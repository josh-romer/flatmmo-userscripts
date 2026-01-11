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
      ];
      perSystem =
        {
          config,
          pkgs,
          system,
          ...
        }:
        let
          userscriptNames = [
            "better-custom-hotkeys"
            "current-action-ui"
            "chat-space-fix"
          ];
          mkFromName =
            packageName:
            pkgs.callPackage ./mkUserscript.nix {
              inherit packageName;
              packagePath = "packages/better-custom-hotkeys/";
            };
          userscriptAttrs = pkgs.lib.genAttrs userscriptNames mkFromName;
        in
        {
          # This sets `pkgs` to a nixpkgs with allowUnfree option set.
          _module.args.pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
            overlays = [ inputs.bun2nix.overlays.default ];
          };

          treefmt = {
            programs.biome.enable = true;
            programs.nixfmt = {
              enable = true;
              excludes = [ "bun.nix" ];
            };
          };

          packages = {
            # Produce a package for this template with bun2nix in
            # the overlay
            default = pkgs.callPackage ./mkStaticSite.nix {
              userscripts = pkgs.lib.attrValues userscriptAttrs;
            };
          }
          // userscriptAttrs;
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              bun
              # Add the bun2nix binary to our devshell
              # Optional now that we have a binary on npm
              bun2nix.packages.${system}.default
            ];

            shellHook = ''
              export PACKAGESDIR=$(pwd)/packages/
              export USERSCRIPTS=${builtins.concatStringsSep "," userscriptNames}
              export BUILD_ENV=dev
              bun install --frozen-lockfile
            '';
          };
        };
    };
}
