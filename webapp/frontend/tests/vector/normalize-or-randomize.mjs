/*jslint node: true, maxlen: 80 */

import THREE from "../global-three";
import vector from "../../scripts/vector";
import {assertEqualNumbers} from "./common";

var a = new THREE.Vector3(0, 0, 0);
vector.normalizeOrRandomize(a);
assertEqualNumbers(a.length(), 1);
