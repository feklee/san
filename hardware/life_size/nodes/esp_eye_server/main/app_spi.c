// Based on the SPI slave example in ESP-IDF (public domain / CC0).

#include "driver/spi_slave.h"
#include "esp_log.h"
#include "app_wifi.h"

static const char *TAG = "spi";

// ESP-EYE
#define GPIO_MOSI 2  // TP4: SPI_DIN:  IO2  GPIO2
#define GPIO_MISO 12 // TP3: SPI_DOUT: IO12 MTDI
#define GPIO_SCLK 0  // TP2: SPI_CLK:  IO0  GPIO0
#define GPIO_CS 19   // TP1: SPI_CS:   IO19 GPIO19

#define RECVBUF_SIZE 129

void app_spi_main() {
  esp_err_t ret;
  WORD_ALIGNED_ATTR char recvbuf[RECVBUF_SIZE];

  // Configuration for the SPI bus:
  spi_bus_config_t buscfg = {
            .mosi_io_num = GPIO_MOSI,
            .miso_io_num = GPIO_MISO,
            .sclk_io_num = GPIO_SCLK
  };

  // Configuration for the SPI slave interface:
  spi_slave_interface_config_t slvcfg = {
            .mode = 3,
            .spics_io_num = GPIO_CS,
            .queue_size = 3
  };

  // Enable pull-ups on SPI lines so we don't detect rogue pulses
  // when no master is connected:
  gpio_set_pull_mode(GPIO_MOSI, GPIO_PULLUP_ONLY);
  gpio_set_pull_mode(GPIO_SCLK, GPIO_PULLUP_ONLY);
  gpio_set_pull_mode(GPIO_CS, GPIO_PULLUP_ONLY);

  // Initialize SPI slave interface:
  ret = spi_slave_initialize(HSPI_HOST, &buscfg, &slvcfg, 1);
  assert(ret == ESP_OK);

  // Set up a transaction:
  spi_slave_transaction_t t = {
                               .length = (RECVBUF_SIZE - 1) * 8,
                               .rx_buffer = recvbuf
  };

  while (1) {
    // The call below enables the SPI slave interface to
    // send/receive to the sendbuf and recvbuf. The transaction is
    // initialized by the SPI master, however, so it will not
    // actually happen until the master starts a hardware
    // transaction by pulling CS low and pulsing the clock etc.
    spi_slave_transmit(HSPI_HOST, &t, portMAX_DELAY);

    // `spi_slave_transmit` does not return until the master has
    // done a transmission, so by here we have sent our data and
    // received data from the master. Print it.
    ESP_LOGI(TAG, "Received: %s\n", recvbuf);

    wifi_set_ip_based_on_id('B');
  }
}
