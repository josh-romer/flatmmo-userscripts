{
  bun2nix,
  stdenv,
  ...
}:
stdenv.mkDerivation rec {
  pname = "test-build";
  version = "1.0.0";

  src = ./.;

  nativeBuildInputs = [
    bun2nix.hook
  ];

  bunDeps = bun2nix.fetchBunDeps {
    bunNix = ./bun.nix;
  };

  buildPhase = ''
    bun build ./packages/better-custom-hotkeys/index.ts --outfile dist/${pname}.user.js 
  '';

  installPhase = ''
    mkdir -p $out/dist

    cp -R ./dist $out
  '';
}
