{
  bun2nix,
  stdenv,
  userscripts,
  lib,
  ...
}:
let
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

  src = ./.;

  nativeBuildInputs = [
    bun2nix.hook
  ]
  ++ userscripts;

  buildInputs = userscripts;

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
