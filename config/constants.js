export const animation = {
  SHORT: 0.2,
  DEFAULT: 0.35,
  MEDIUM: 0.45,
  LONG: 0.7
}

function getDVH() {
  let a, b;
  document.body.style.setProperty("height", "100dvh");
  a = document.body.clientHeight;
  document.body.style.setProperty("height", "100vh");
  b = document.body.clientHeight;
  document.body.style.removeProperty("height");
  return b - a;
}

export const dvhDiff = getDVH();
