{
  description = "Bun2Nix workspace sample";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";

    bun2nix.url = "github:nix-community/bun2nix/2.0.6";
    bun2nix.inputs.nixpkgs.follows = "nixpkgs";
    bun2nix.inputs.systems.follows = "systems";

    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix.url = "github:numtide/treefmt-nix";
    github-actions-nix.url = "github:synapdeck/github-actions-nix";
  };

  # Use the cached version of bun2nix from the nix-community cli
  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
      "https://nix-community.cachix.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
  };

  outputs =
    inputs@{
      flake-parts,
      nixpkgs,
      bun2nix,
      ...
    }:

    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];
      imports = [
        inputs.treefmt-nix.flakeModule
        inputs.github-actions-nix.flakeModule
      ];
      perSystem =
        { pkgs, system, ... }:
        {
          # This sets `pkgs` to a nixpkgs with allowUnfree option set.
          _module.args.pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
            overlays = [ inputs.bun2nix.overlays.default ];
          };

          treefmt = {
            programs.biome.enable = true;
          };

          githubActions = {
            enable = true;
            workflowsDir = "./.github/workflows";
            workflows = {

              ci = {
                name = "CI";
                on = [
                  "push"
                  "pull_request"
                ];
                jobs = {
                  build = {
                    runsOn = "ubuntu-latest";
                    steps = [
                      {
                        uses = "actions/checkout@v4";
                      }
                      {
                        name = "Build";
                        run = "npm run build";
                      }
                    ];
                  };
                };
              };

            };
          };

          packages = {
            # Produce a package for this template with bun2nix in
            # the overlay
            default = pkgs.callPackage ./mkUserscript.nix {
              packagePath = ./packages/better-custom-hotkeys;
            };
          };
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              bun
              # Add the bun2nix binary to our devshell
              # Optional now that we have a binary on npm
              bun2nix.packages.${system}.default
            ];

            shellHook = ''
              bun install --frozen-lockfile
            '';
          };
        };
    };
}
