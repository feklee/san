/*jslint node: true, maxlen: 80 */

import vector from "../../scripts/vector";
import {assertEqualNumbers} from "./common";

export default function () {
    var a;
    var r;

    // 1 - see 3dm file
    a = 1.2134401624490576;
    r = vector.tiltAnglePlusHalfTetAngle(a);
    assertEqualNumbers(r[0], 0.2581, 0.001);
    assertEqualNumbers(r[1], 2.169, 0.001);

    // 2
    a = 0;
    r = (vector.tiltAnglePlusHalfTetAngle(a));
    assertEqualNumbers(r[0], 0.0000, 0.001);
    assertEqualNumbers(r[1], 0.9553, 0.0001);

    // 3
    a = Math.PI;
    r = (vector.tiltAnglePlusHalfTetAngle(a));
    assertEqualNumbers(r[0], 2.186, 0.001);
    assertEqualNumbers(r[1], 3.142, 0.001);

    // 4
    a = 2.791;
    r = (vector.tiltAnglePlusHalfTetAngle(a));
    assertEqualNumbers(r[0], 1.836, 0.001);
    assertEqualNumbers(r[1], 3.142, 0.001);
};
