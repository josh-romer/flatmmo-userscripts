{
  bun2nix,
  stdenv,
  packagePath,
  ...
}:
let
  pkgJsonContents = builtins.readFile "${packagePath}/package.json";
  package = builtins.fromJSON pkgJsonContents;
  pname = package.name;
  inherit (package) version;
  module = "${packagePath}/${package.module}";
  metadata = builtins.readFile "${packagePath}/metadata.js";
in
stdenv.mkDerivation {
  inherit pname version;

  src = ./.;

  nativeBuildInputs = [
    bun2nix.hook
  ];

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  buildPhase = ''
    bun build ${module} --outfile dist/${pname}.user.js --banner "${metadata}"
  '';

  installPhase = ''
    mkdir -p $out/dist

    cp -R ./dist $out
  '';
}
