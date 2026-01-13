{
  bun2nix,
  stdenv,
  packageName,
  lib,
  ...
}:
let
  inherit (lib.fileset) toSource unions;
  pname = packageName;
  version = "1.0.0";
  build-script = "./packages/build/build-userscript-cli.ts";
in
stdenv.mkDerivation {
  inherit pname version;

  src = toSource {
    root = ./.;
    fileset = unions [
      ./package.json
      ./packages
      ./bun.nix
      ./bun.lock
      ./bunfig.toml
    ];
  };
  nativeBuildInputs = [
    bun2nix.hook
  ];
  dontRunLifecycleScripts = true;

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  buildPhase = ''
    bun  ${build-script} --scriptName=${packageName}
  '';

  installPhase = ''
    mkdir -p $out/share/userscripts

    cp ./dist/userscripts/**.js $out/share/userscripts/
  '';
}
