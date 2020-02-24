#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <device> <MHz> <node ID>" >&2
    exit 2
fi

echo "#define ID $3" >id.h

cp ../../../../sharedSettings.h .

arduino --board arduino:avr:pro:cpu=$2MHzatmega328 \
      --port "$1" --upload ArduinoFirmware.ino
