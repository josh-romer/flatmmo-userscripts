{
  bun2nix,
  stdenv,
  userscripts,
  lib,
  ...
}:
let
  inherit (lib.fileset) toSource unions;
  pname = "username-index-site";
  version = "0.0.1";
  userscript-metadata = (
    map (x: rec {
      filename = "${x.pname}.user.js";
      path = "${x}/share/userscripts/${filename}";
      packageName = x.pname;
    }) userscripts
  );
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


  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  buildPhase = ''
    bun packages/static-userscript-index/build-site-cli.ts --data='${builtins.toJSON userscript-metadata}'
  '';

  installPhase = ''
    mkdir -p $out/static

    cp -R ./dist/static $out
  '';
}
