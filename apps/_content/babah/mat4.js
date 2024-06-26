function identity() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
};

function inverse(a) {
  const D = (a[0] * (a[5] * (a[10] * a[15] - a[11] * a[14]) + a[6] * (a[11] * a[13] - a[9] * a[15]) + a[7] * (a[9] * a[14] - a[13] * a[10]))) - (a[1] * (a[4] * (a[10] * a[15] - a[11] * a[14]) + a[6] * (a[11] * a[12] - a[8] * a[15]) + a[7] * (a[8] * a[14] - a[12] * a[10]))) + (a[2] * (a[4] * (a[9] * a[15] - a[11] * a[13]) + a[5] * (a[11] * a[12] - a[8] * a[15]) + a[7] * (a[8] * a[13] - a[12] * a[9]))) - (a[3] * (a[4] * (a[9] * a[14] - a[10] * a[13]) + a[5] * (a[10] * a[12] - a[8] * a[14]) + a[6] * (a[8] * a[13] - a[12] * a[9])));

  return [
    1 * (a[5] * (a[10] * a[15] - a[11] * a[14]) + a[6] * (a[11] * a[13] - a[9] * a[15]) + a[7] * (a[9] * a[14] - a[13] * a[10])) / D,
    -1 * (a[1] * (a[10] * a[15] - a[11] * a[14]) + a[2] * (a[11] * a[13] - a[9] * a[15]) + a[3] * (a[9] * a[14] - a[13] * a[10])) / D,
    1 * (a[1] * (a[6] * a[15] - a[7] * a[14]) + a[2] * (a[7] * a[13] - a[5] * a[15]) + a[3] * (a[5] * a[14] - a[13] * a[6])) / D,
    -1 * (a[1] * (a[6] * a[11] - a[7] * a[10]) + a[2] * (a[7] * a[9] - a[5] * a[11]) + a[3] * (a[5] * a[10] - a[9] * a[6])) / D,
    -1 * (a[4] * (a[10] * a[15] - a[11] * a[14]) + a[6] * (a[11] * a[12] - a[8] * a[15]) + a[7] * (a[8] * a[14] - a[12] * a[10])) / D,
    1 * (a[0] * (a[10] * a[15] - a[11] * a[14]) + a[2] * (a[11] * a[12] - a[8] * a[15]) + a[3] * (a[8] * a[14] - a[12] * a[10])) / D,
    -1 * (a[0] * (a[6] * a[15] - a[7] * a[14]) + a[2] * (a[7] * a[12] - a[4] * a[15]) + a[3] * (a[4] * a[14] - a[12] * a[6])) / D,
    1 * (a[0] * (a[6] * a[11] - a[7] * a[10]) + a[2] * (a[7] * a[8] - a[4] * a[11]) + a[3] * (a[4] * a[10] - a[8] * a[6])) / D,
    1 * (a[4] * (a[9] * a[15] - a[11] * a[13]) + a[5] * (a[11] * a[12] - a[8] * a[15]) + a[7] * (a[8] * a[13] - a[12] * a[9])) / D,
    -1 * (a[0] * (a[9] * a[15] - a[11] * a[13]) + a[1] * (a[11] * a[12] - a[8] * a[15]) + a[3] * (a[8] * a[13] - a[12] * a[9])) / D,
    1 * (a[0] * (a[5] * a[15] - a[7] * a[13]) + a[1] * (a[7] * a[12] - a[4] * a[15]) + a[3] * (a[4] * a[13] - a[12] * a[5])) / D,
    -1 * (a[0] * (a[5] * a[11] - a[7] * a[9]) + a[1] * (a[7] * a[8] - a[4] * a[11]) + a[3] * (a[4] * a[9] - a[8] * a[5])) / D,
    -1 * (a[4] * (a[9] * a[14] - a[10] * a[13]) + a[5] * (a[10] * a[12] - a[8] * a[14]) + a[6] * (a[8] * a[13] - a[12] * a[9])) / D,
    1 * (a[0] * (a[9] * a[14] - a[10] * a[13]) + a[1] * (a[10] * a[12] - a[8] * a[14]) + a[2] * (a[8] * a[13] - a[12] * a[9])) / D,
    -1 * (a[0] * (a[5] * a[14] - a[6] * a[13]) + a[1] * (a[6] * a[12] - a[4] * a[14]) + a[2] * (a[4] * a[13] - a[12] * a[5])) / D,
    1 * (a[0] * (a[5] * a[10] - a[6] * a[9]) + a[1] * (a[6] * a[8] - a[4] * a[10]) + a[2] * (a[4] * a[9] - a[8] * a[5])) / D,
  ];
};

function viewMatrix(eye, target, up) {
  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  function normalize(a) {
    const length = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    return [a[0] / length, a[1] / length, a[2] / length];
  }

  const forward = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]])
  const right = normalize(cross(up, forward));
  up = normalize(cross(forward, right));
  return inverse([
    right[0], up[0], forward[0], eye[0],
    right[1], up[1], forward[1], eye[1],
    right[2], up[2], forward[2], eye[2],
    0, 0, 0, 1
  ]);
}

function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
  ];
};

function perspectiveProjectionMatrix(fov, aspect, near = 0.1, far = 500) {
  const f = 1 / Math.tan(0.5 * fov);
  const rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, near * far * rangeInv * 2,
    0, 0, -1, 0
  ];
}

function scaleMatrix(sx, sy, sz) {
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1,
  ];
};

function translationMatrix(dx, dy, dz) {
  return [
    1, 0, 0, dx,
    0, 1, 0, dy,
    0, 0, 1, dz,
    0, 0, 0, 1,
  ];
};

function transpose(a) {
  return [
    a[0], a[4], a[8], a[12],
    a[1], a[5], a[9], a[13],
    a[2], a[6], a[10], a[14],
    a[3], a[7], a[11], a[15],
  ];
};

function xRotationMatrix(angle) {
  const C = Math.cos(angle);
  const S = Math.sin(angle);
  return [
    1, 0, 0, 0,
    0, C, -S, 0,
    0, S, C, 0,
    0, 0, 0, 1,
  ];
};

function yRotationMatrix(angle) {
  const C = Math.cos(angle);
  const S = Math.sin(angle);
  return [
    C, 0, S, 0,
    0, 1, 0, 0,
    -S, 0, C, 0,
    0, 0, 0, 1,
  ];
};

function zRotationMatrix(angle) {
  const C = Math.cos(angle);
  const S = Math.sin(angle);
  return [
    C, -S, 0, 0,
    S, C, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
};
