#pragma once

// With DMA enabled, the ESP32 SPI driver wants to receive multiples of 32 bits:
constexpr uint8_t spiBufferLength = 8;
extern char spiRxBuffer[spiBufferLength];
extern char spiTxBuffer[spiBufferLength];

void spiTransferSetup();
void doSpiTransfer();
void clearSpiTxBuffer();
