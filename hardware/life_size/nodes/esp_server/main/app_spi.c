// Based on the SPI slave example in ESP-IDF (public domain / CC0).

#include <string.h>
#include <sys/param.h>
#include "driver/spi_common.h"
#include "driver/spi_master.h"
#include "driver/spi_slave.h"
#include "esp_log.h"
#include "esp_http_client.h"
#include "app_wifi.h"

static const char *TAG = "spi";

// ESP-EYE
#define GPIO_MOSI 2  // TP4: SPI_DIN:  IO2  GPIO2
#define GPIO_MISO 12 // TP3: SPI_DOUT: IO12 MTDI
#define GPIO_SCLK 0  // TP2: SPI_CLK:  IO0  GPIO0
#define GPIO_CS 19   // TP1: SPI_CS:   IO19 GPIO19

#define BUF_SIZE 8 // bytes
char queued_sendbuf[BUF_SIZE];
WORD_ALIGNED_ATTR char sendbuf[BUF_SIZE];
WORD_ALIGNED_ATTR char recvbuf[BUF_SIZE];

static void send_pair_to_server(const char *pair)
{
    char url[81];
    sprintf(url, "http://192.168.100.100:8081/%.4s", pair);

    esp_http_client_config_t config = { .url = url };
    esp_http_client_handle_t client = esp_http_client_init(&config);

    esp_err_t err = esp_http_client_perform(client);
    ESP_LOGI(TAG, "URL: %s", url);
    if (err == ESP_OK) {
        ESP_LOGI(TAG, "HTTP GET Status = %d, content_length = %d",
                esp_http_client_get_status_code(client),
                esp_http_client_get_content_length(client));
    } else {
        ESP_LOGE(TAG, "HTTP GET request failed: %s", esp_err_to_name(err));
    }

    esp_http_client_cleanup(client);
}

static void parse_recvbuf()
{
    if (strncmp(recvbuf, "ID=", 3) == 0) {
        wifi_set_ip_based_on_id(recvbuf[3]);
        return;
    } else {
        send_pair_to_server(recvbuf);
    }
}

static void clear_queued_sendbuf() {
  memset(sendbuf, '\0', BUF_SIZE);
}

static void log_recvbuf() {
  char s[BUF_SIZE + 1];
  memcpy(s, recvbuf, BUF_SIZE);
  recvbuf[BUF_SIZE + 1] = '\0';
  ESP_LOGI(TAG, "Received: \"%s\"\n", recvbuf);
}

void app_spi_send(const char * const data, const int length) {
  // `sendbuf` isn't written to directly, in case that would interfere with an
  // interrupt handler accessing it in the middle of copying data to it (not
  // sure if that's possible, but just in case)
  clear_queued_sendbuf();
  memcpy(queued_sendbuf, data, MIN(BUF_SIZE, length));
}

void app_spi_main() {
  esp_err_t ret;

  clear_queued_sendbuf();

  // Configuration for the SPI bus:
  spi_bus_config_t buscfg = {
            .mosi_io_num = GPIO_MOSI,
            .miso_io_num = GPIO_MISO,
            .sclk_io_num = GPIO_SCLK
  };

  // Configuration for the SPI slave interface:
  spi_slave_interface_config_t slvcfg = {
            .mode = 1,
            .spics_io_num = GPIO_CS,
            .queue_size = 3
  };

  // Enable pull-ups on SPI lines so we don't detect rogue pulses
  // when no master is connected:
  gpio_set_pull_mode(GPIO_MOSI, GPIO_PULLUP_ONLY);
  gpio_set_pull_mode(GPIO_SCLK, GPIO_PULLUP_ONLY);
  gpio_set_pull_mode(GPIO_CS, GPIO_PULLUP_ONLY);

  // Initialize SPI slave interface:
  ret = spi_slave_initialize(VSPI_HOST, &buscfg, &slvcfg, 1);
  assert(ret == ESP_OK);

  // Set up a transaction:
  spi_slave_transaction_t t = {
                               .length = (BUF_SIZE - 1) * 8,
                               .tx_buffer = sendbuf,
                               .rx_buffer = recvbuf
  };

  while (1) {
    memcpy(sendbuf, queued_sendbuf, BUF_SIZE);
    ESP_LOGI(TAG, "Sending: \"%s\"\n", sendbuf);
    spi_slave_transmit(VSPI_HOST, &t, portMAX_DELAY); // initiated by master

    log_recvbuf();

    parse_recvbuf();
  }
}
