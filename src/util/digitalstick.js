const DEADZONE = 0.5;

function leftStickDown() {
  return contro.leftStick.y > DEADZONE;
}

function leftStickUp() {
  return contro.leftStick.y < -DEADZONE;
}

function leftStickRight() {
  return contro.leftStick.x > DEADZONE;
}

function leftStickLeft() {
  return contro.leftStick.x < -DEADZONE;
}

function controAny() {
  if (contro.presses("a")) return true;
  if (contro.presses("b")) return true;
  if (contro.presses("x")) return true;
  if (contro.presses("y")) return true;
  if (contro.presses("up")) return true;
  if (contro.presses("down")) return true;
  if (contro.presses("left")) return true;
  if (contro.presses("right")) return true;
  if (contro.presses("l")) return true;
  if (contro.presses("lt")) return true;
  if (contro.presses("lsb")) return true;
  if (contro.presses("r")) return true;
  if (contro.presses("rt")) return true;
  if (contro.presses("rsb")) return true;
  return false;
}
