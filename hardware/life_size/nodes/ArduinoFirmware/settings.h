#pragma once

#include "Arduino.h"

#undef DEBUG

#include "sharedSettings.h"

constexpr uint32_t bootDelay = 2000; // ms (time to wait for ESP-EYE to boot)

const uint8_t maxPairMessageQueueSize = 20;
constexpr uint8_t ledDataPin = 4;
constexpr uint8_t rxPinNumberOfPort1 = 2;
constexpr uint8_t txPinNumberOfPort1 = A0;
constexpr uint8_t rxPinNumberOfPort2 = 3;
constexpr uint8_t txPinNumberOfPort2 = A1;
constexpr uint8_t rxPinNumberOfPort3 = 8;
constexpr uint8_t txPinNumberOfPort3 = A2;
constexpr uint8_t rxPinNumberOfPort4 = 9;
constexpr uint8_t txPinNumberOfPort4 = A3;
const uint32_t idSendPeriod = 1000; // ms

#ifdef DEBUG

const uint32_t announcementPeriod = 2000; // ms
const uint8_t bitDurationExp = 9; // TODO: make bigger for IR?
const uint32_t parentExpiryDuration = 2.5 * 2000; // ms
const uint8_t ledBrightness = 20;

#else

// The maximum data rate supported by MultiTrans when communicating
// with four neighboring nodes is at about ~3kbit/s uni-directionally
// (bit duration exponent: 11).
//
// On stability problems, reduce the data rate (by increasing the bit
// duration exponent) and increase the announcement period.
const uint8_t bitDurationExp = 11;

// The announcement period needs to be long enough so that all pairs
// can be transmitted in between two announcements. It depends on the
// bit rate as well as on the maximum number of nodes.
//
// For now, it can be estimated experimentally by connecting all nodes
// in a row and looking at the output. One needs to keep in mind,
// though, that loops can increase the number of pairs
// considerably. So maybe it's best to multiply the result with a
// factor. In the end it may be possible to calculate the annoncement
// period automatically.
const uint32_t announcementPeriod = graphUpdateInterval; // ms

// Parents are given an expiry time. This is so that they don't change
// abruptly in case there is a flaky connection (which could make the
// graph change dramatically).
const uint32_t parentExpiryDuration = connectionExpiryDuration; // ms

// Avoid exceeding the Arduino's power supply!
const uint8_t ledBrightness = 150;

#endif
