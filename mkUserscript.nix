{
  bun2nix,
  stdenv,
  packageName,
  packagePath,
  ...
}:
let
  pkgJsonContents = builtins.readFile "${packagePath}/package.json";
  package = builtins.fromJSON pkgJsonContents;
  pname = packageName;
  version = "1.0.0";
  # inherit (package) version;
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
    bun build-userscript-cli.ts --scriptName=${packageName}
  '';

  installPhase = ''
    mkdir -p $out/share/userscripts

    cp ./dist/userscripts/**.js $out/share/userscripts/
  '';
}
