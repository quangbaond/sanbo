<script setup>
import { onMounted, ref, watch, inject, onUnmounted } from 'vue';
import Highcharts from 'highcharts';
import { socket } from '@/socket';
import { getListSymbol } from '@/services/binance';
import { UserOutlined } from '@ant-design/icons-vue';
import { getUser } from '@/services/auth';
import { formatCurrency } from '@/common';
import moment from 'moment';
import { useToast } from 'vue-toast-notification';
import { getRoomActive } from '@/services/room';
import { useRouter } from 'vue-router';
import { formatterNumber, parserNumber } from '../common';
const router = useRouter();
const toast = useToast();
const binanceType = ref('');
const chart = ref(null);
const time = ref(parseInt(router.currentRoute.value.params.time));

var tt = "#01b58c",
  et = "#f81057";
const at = window.innerWidth <= 768 ? "mobile" : "pc";
const maxPoints = at == "mobile" ? 20 : 30;
const colorTemplate = '{#ge point.open point.close}#ff6e6e{else}#51af7b{/ge}';
const chartRef = ref(null);
const dataChart = ref([]);
const symbolData = ref([]);
const sessionData = ref([]);
const tradeData = ref([]);
const tradeOnline = ref([]);
const chartOptions = ref({
  chart: {
    type: 'candlestick',
    styledMode: true,
    backgroundColor: "#001f3b",
    panning: !1,
    time: {
      timezone: 'Asia/Ho_Chi_Minh',
    },
    events: {
      load: function () {
        const series = this.series;

      }
    }
  },
  rangeSelector: {
    enabled: false,
    selected: 4,
    inputEnabled: false
  },
  scrollbar: {
    enabled: false
  },
  navigator: {
    enabled: false
  },
  credits: {
    enabled: !1
  },
  stockTools: {
    gui: {
      enabled: !1
    }
  },
  exporting: {
    enabled: !1
  },
  plotOptions: {
    candlestick: {
      lineColor: et,
      upLineColor: tt,
      pointWidth: (at == "pc") ? 12 : 7,
      maxPointWidth: (at == "pc") ? 12 : 7,
    },
    column: {
      minPointLength: 2,
      pointWidth: "pc" !== at ? 7 : 12,
      maxPointWidth: "pc" !== at ? 7 : 12,
      borderWidth: 0,
      pointPadding: 0,
      groupPadding: 0
    },
    series: {
      zIndex: 2,
      states: {
        inactive: {
          opacity: 1
        }
      },
      allowPointSelect: !1,
      point: {
        events: {
          click: function () { }
        }
      }
    }
  },
  xAxis: {
    overscroll: 0,
    gridLineWidth: 1,
    crosshair: {
      className: 'highcharts-crosshair-custom',
      enabled: true
    },
    lineWidth: 0,
    minorGridLineWidth: 0,
    lineColor: "transparent",
    minorTickLength: 0,
    tickLength: 0
  },
  yAxis: [
    {
      crosshair: {
        snap: false,
        label: {
          className: 'highcharts-crosshair-custom-labelss',
          enabled: true,
          format: '{value:.2f}'
        },
        enabled: true
      },
      labels: {
        align: 'left'
      },
      gridLineWidth: 0,
      height: '70%'
    },
    {
      crosshair: {
        className: 'highcharts-crosshair-customs',
        snap: false,
        enabled: false,
        label: {
          format:
            '{#if value ge 1000000} {(divide value 1000000):.2f} ' +
            'M {else} {value} {/if}',
          className: 'highcharts-crosshair-custom-label',
          enabled: false
        }
      },
      labels: {
        align: 'left',
        enabled: true,
      },
      top: '80%',
      height: '20%',
      offset: 0
    }
  ],
  tooltip: {
    shape: 'square',
    split: false,
    shared: true,
    headerShape: 'callout',
    shadow: false,
    format: `<span style="font-size: 1.4em">{point.series.name}</span>
                  O<span style="color:${colorTemplate}";>{point.open}</span>
                  H<span style="color:${colorTemplate}";>{point.high}</span>
                  L<span style="color:${colorTemplate}";>{point.low}</span>
                  C<span style="color:${colorTemplate}";>{point.close}
                  {(subtract point.open point.close):.2f}
                  {(multiply (divide (subtract point.open point.close) point.close) 100):.2f}%
                  </span>
                  <br>
                  Volume<span style="color:${colorTemplate}";>{points.1.y}</span>`,
    positioner: () => ({ x: 0, y: 0 })
  },
  series: [
    {
      type: 'candlestick',
      id: 'ohlc',
      name: binanceType.value + ' Price',
      color: et,
      upColor: tt,
      lastPrice: {
        enabled: true,
        label: {
          enabled: (at == "pc") ? true : false,
          align: 'left',
          format: '{value}',
          style: { "color": "blue", "fontWeight": "normal", "fontSize": "2px", "textAlign": "center" }
        }
      },
      data: dataChart.value
    },
    {
      type: 'column',
      lastPrice: {
        enabled: true,
        label: {
          format: '{#if value ge 1000000} ' +
            '{(divide value 1000000):.2f} M {else} {value} {/if}',
          enabled: false,
          align: 'left',
          x: 8
        }
      },
      keys: ['x', 'y', 'className'],
      id: 'volume',
      name: 'Volume',
      data: dataChart.value.map(item => [item[0], item[5], item[1] < item[4] ? 'highcharts-point-up' : 'highcharts-point-down']),
      yAxis: 1,
    },
  ],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 800,
      },
      chartOptions: {
        rangeSelector: {
          inputEnabled: false,
          selected: 4
        },
        xAxis: {
          overscroll: 0,
        },
        yAxis: [{
          labels: {
            align: 'left',
            enabled: true,
          },
          height: '60%', // Adjust height for mobile
        }, {
          top: '65%',
          height: '35%', // Adjust height for mobile
        }]
      }
    }]
  }
});
const hour = ref(0);
const minute = ref(0);
const second = ref(0);

const chartStyle = {
  width: '100%',
  height: '400px',
}
const optionsSymbol = ref([]);
const user = ref(JSON.parse(localStorage.getItem('user')));
const typeTime = ref(time.value);
const optionTypeTime = ref([])

onMounted(() => {
  chart.value = Highcharts.stockChart(chartRef.value, chartOptions.value);
  getUser().then(res => {
    user.value = res.user;
    getListSymbol().then(res => {
      optionsSymbol.value = res.data.map(item => ({ value: item.name, label: item.name }));
      binanceType.value = optionsSymbol.value[0].value;
      socket.emit('binance', binanceType.value);
    })
    getRoomActive().then(res => {
      // typeTime.value = res.roomData[0].time;
      // check time
      const timeData = res.roomData.find(item => item.time === typeTime.value);
      if (timeData) {

      } else {
        router.push(`/trade/${res.roomData[0].time}`);
      }
      optionTypeTime.value = res.roomData.map(item => ({ value: item.time, label: `${item.name}` }));
    })
  })

  socket.on(`trade`, (data) => {
    user.value.balance = data.balance;
  })

  socket.on(`reward`, (data) => {
    if(data.status == 'success'){
      toast.success('Giao dịch thành công');
      user.value.balance = data.balance;
    } else {
      toast.error('Giao dịch thất bại');
    }
  })
});
onUnmounted(() => {
  socket.off(`trade`);
  socket.off(`reward`);
})

const market = ref('');
const changeMarket = (value) => {
  binanceType.value = value;
  toast.success('Đã thay đổi thị trường');
  socket.emit('binance', binanceType.value);
}
const changeTypeTime = (value) => {
  typeTime.value = value;
}
watch(typeTime, (newVal, oldVal) => {
  window.location.href = `/trade/${newVal}`;
})
const intervalTime = ref(null);
const getTimeSession = async (symbolName) => {
  if (!intervalTime.value) {
    intervalTime.value = setInterval(() => {
      socket.emit(`getTimeSession`, {
        symbolName: symbolName,
        userId: user.value._id,
        time: typeTime.value,
      });
    }, 1000);
  } else {
    console.log('Interval đã được thiết lập trước đó');
  }
}
const optionMoney = ref([
  { value: 50000, label: '50.000' },
  { value: 100000, label: '100.000' },
  { value: 200000, label: '200.000' },
  { value: 500000, label: '500.000' },
  { value: 1000000, label: '1.000.000' },
  { value: 2000000, label: '2.000.000' },
  { value: 5000000, label: '5.000.000' },
  { value: 10000000, label: '10.000.000' },
  { value: 20000000, label: '20.000.000' },
]);
const disabledMoney = ref(false);

const swal = inject('$swal');
const money = ref(0);
const changeMoney = (value) => {
  money.value = value;
}
const lastPrice = ref(0);
const updateDataChart = (data) => {
  if (chart.value) {
    hour.value = data.time.split(':')[0];
    minute.value = data.time.split(':')[1];
    second.value = data.time.split(':')[2];
    if (hour.value == 0 && minute.value == 0 && second.value <= 10) {
      disabledMoney.value = true;
    } else {
      disabledMoney.value = false;
    }
    symbolData.value = data.symbolData;
    dataChart.value = data.data;

    const lastPointX = chart.value.series[0].data[chart.value.series[0].data.length - 1];
    const lastPointY = chart.value.series[1].data[chart.value.series[1].data.length - 1];
    if (lastPointX.x == data.data[0]) {
      lastPointX.update([
        data.data[0],
        data.data[1],
        data.data[2],
        data.data[3],
        data.data[4],
      ], false);
      lastPointY.update([data.data[0], data.data[5], data.data[1] < data.data[4] ? 'highcharts-point-up' : 'highcharts-point-down']);
    } else {
      chart.value.series[0].addPoint([
        data.data[0],
        data.data[1],
        data.data[2],
        data.data[3],
        data.data[4],
      ], false, chart.value.series[0].data.length >= maxPoints, {
        duration: 500, // thời gian animation (ms)
        easing: 'easeOutBounce' // kiểu easing
      });
      chart.value.series[1].addPoint([data.data[0], data.data[5], data.data[1] < data.data[4] ? 'highcharts-point-up' : 'highcharts-point-down'], true, chart.value.series[0].data.length >= maxPoints, {
        duration: 500, // thời gian animation (ms)
        easing: 'easeOutBounce' // kiểu easing
      });
    }
    chart.value.redraw();
  }
}
const listener = (newVal) => {
  socket.on(`binance-${newVal}`, (data) => {
    if (chart.value) {
      intervalTime.value = null;
      getTimeSession(newVal, typeTime.value);
      dataChart.value = data;
      chart.value.series[0].setData(dataChart.value.map(item => [item[0], item[1], item[2], item[3], item[4]]));
      chart.value.series[1].setData(dataChart.value.map(item => [item[0], item[5], item[1] < item[4] ? 'highcharts-point-up' : 'highcharts-point-down']));
    } else {
      chart.value = Highcharts.stockChart(chartRef.value, chartOptions.value);
      dataChart.value = data;
      intervalTime.value = null;
      getTimeSession(newVal, typeTime.value);
      chart.value.series[0].setData(dataChart.value.map(item => [item[0], item[1], item[2], item[3], item[4]]));
      chart.value.series[1].setData(dataChart.value.map(item => [item[0], item[5], item[1] < item[4] ? 'highcharts-point-up' : 'highcharts-point-down']));
    }
  });
  socket.on(`${newVal}-session-time`, (data) => {
    updateDataChart(data)
    lastPrice.value = data.data[4];
    tradeData.value = data.tradeData;
    tradeOnline.value = data.tradeOnline;
    sessionData.value = data.sessionData;
  });

  socket.emit('binance', newVal);

}
watch(binanceType, (newVal, oldVal) => {
  // Remove the old event listener
  socket.off(`binance-${oldVal}`);
  socket.off(`${oldVal}-session-time`);
  if (oldVal) {
    clearInterval(intervalTime.value);
    intervalTime.value = null;
    chart.value.destroy();
    chart.value = null;
    dataChart.value = [];
  }
  listener(newVal);
  // Add the new event listener
});

const tradeDing = (type) => {
  if (money.value <= 0) {
    swal.fire({
      title: 'Thông báo',
      text: 'Vui lòng nhập số tiền',
      icon: 'warning'
    })
    return;
  }
  if (money.value > user.value.balance) {
    swal.fire({
      title: 'Thông báo',
      text: 'Số dư không đủ',
      icon: 'warning'
    })
    return;
  }
  socket.emit('tradeDing', {
    symbol: binanceType.value,
    amount: money.value,
    price: lastPrice.value,
    userId: user.value._id,
    sessionId: sessionData.value._id,
    type: type,
  });
  swal.fire({
    title: 'Thông báo',
    text: 'Đã gửi giao dịch',
    icon: 'success'
  })
}

const goBack = () => {
  router.push('/dashboard');
}
</script>

<template>
  <div class="wrapper">
    <header>
      <a-row justify="space-around" align="middle">
        <a-col :md="6" lg="4" xl="4" xxl="4" sm="24">
          <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <img src="@/assets/img/loading.gif" alt="" style="width: 70px; height: 50px;">
            <p style="color: #fff; display: flex; align-self: center; margin-bottom: 0px;">Thời gian: {{ hour < 10 ? '0'
                + hour : hour }}:{{ minute < 10 ? '0' + minute : minute }}:{{ second < 10 ? '0' + second : second }}</p>
          </div>
        </a-col>
        <a-col :md="17" lg="17" xl="17" xxl="17" sm="24">
          <a-row justify="end" :gutter="10" align="middle">
            <a-col :md="3" lg="3" xl="3" xxl="3" style=" margin: 10px 0;">
              <a-button type="primary" @click="goBack">Quay lại</a-button>
            </a-col>
            <a-col :md="3" lg="3" xl="3" xxl="3" style=" margin: 10px 0;">
              <a-button type="primary">Quy tắc</a-button>
            </a-col>

            <a-col :md="4" lg="4" xl="4" xxl="4" style="margin: 10px 0;">
              <a-button type="primary">CSKH</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </header>
    <div class="tradingview-widget-container" style="width: 100%;">
      <iframe scrolling="no" allowtransparency="true" frameborder="0"
        src="https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=uk#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22description%22%3A%22BIT%2FJPY%22%2C%22proName%22%3A%22BITFINEX%3ABTCJPY%22%7D%2C%7B%22description%22%3A%22ASXGOLD%22%2C%22proName%22%3A%22ASX%3AGOLD%22%7D%2C%7B%22description%22%3A%22AUDSILVER%22%2C%22proName%22%3A%22FX_IDC%3AXAGAUD%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A44%2C%22utm_source%22%3A%22trading.vn-amazon.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%2C%22page-uri%22%3A%22trading.vn-amazon.com%2F%3F_ckey%3D720d10b143525bcfaa8163a0f4fae2f1%26symbol%3D710%22%7D"
        title="ticker tape TradingView widget" lang="en"
        style="user-select: none; box-sizing: border-box; display: block; height: 44px; width: 100%;"></iframe>

    </div>
    <a-row>
      <a-col :md="24" :xs="24" :lg="4" :xl="4" :xxl="4" :sm="24" style="margin-bottom: 10px;">
        <div id="ticker-tape">
          <div>
            <img src="@/assets/img/online.gif" alt="" style="width: 25px; height: 20px;">
          </div>
          <div style="display: flex; align-items: center; margin-left: 10px;">
            <p>Tỉ giá</p>
          </div>
        </div>

        <div class="ticker-tape_item">
          <a-row :gutter="10" justify="space-between" v-for="item in symbolData" :key="item._id">
            <a-col :md="8" :lg="8" :xl="8" :xxl="8">
              <p>{{ item.name }}</p>
            </a-col>
            <a-col :md="8" :lg="8" :xl="8" :xxl="8">
              <p>{{ item.base ? item.base.toFixed(2) : item.min.toFixed(2) }}</p>
            </a-col>
            <a-col :md="8" :lg="8" :xl="8" :xxl="8">
              <p>
                <span class="ticker-tape_up"></span>
                <span :class="{ 'up': item.changePercent > 0, 'down': item.changePercent < 0 }"
                  style="margin-left: 10px;">{{ item.changePercent ? item.changePercent.toFixed(2) : item.min.toFixed(2)
                  }}</span>
                <span :class="{ 'up': item.changePercent > 0, 'down': item.changePercent < 0 }"
                  style="margin-left: 5px;">%</span>
              </p>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :md="24" :lg="16" :xl="16" :xxl="16">
        <div ref="chartRef" :style="chartStyle"></div>
        <a-row align="middle" justify="space-between" style="margin-top: 10px; text-align: center; padding: 10px;">
          <a-col :md="24" :lg="24" :xl="24" :xxl="24">
            <div id="market_box" style="margin: 10px;">
              <a-row align="middle" justify="space-between">
                <a-col :md="6" :lg="6" :xl="6" :xxl="6" :sm="24" :xs="24" style="margin: 10px 0; ">
                  <span style="color: #fff; font-size: 16px; font-weight: bold;">Thị trường:</span>
                  <a-select @change="changeMarket" v-model="market" v-model:value="binanceType"
                    style="width: 150px; margin-left: 10px; margin-top: 5px;" size="small" placeholder="Chọn thị trường"
                    :options="optionsSymbol">
                  </a-select>
                </a-col>
                <a-col :md="6" :lg="6" :xl="6" :xxl="6" :sm="24" :xs="24" style="margin: 10px 0; ">
                  <span style="color: #fff; font-size: 16px; font-weight: bold;">Loại giao dịch:</span>

                  <a-select @change="changeTypeTime" v-model:value="typeTime"
                    style="width: 150px; margin-left: 10px; margin-top: 5px;" size="small" placeholder="Chọn thị trường"
                    :options="optionTypeTime">
                  </a-select>
                </a-col>
                <a-col :md="6" :lg="6" :xl="6" :xxl="6" :sm="24" :xs="24" style="margin: 10px 0; ">
                  <p style="color: #fff; font-size: 16px; font-weight: bold; margin-bottom: 0;"> id: {{
                    sessionData?.code
                    }}</p>
                </a-col>
                <a-col :md="6" :lg="6" :xl="6" :xxl="6" :sm="24" :xs="24" style="margin: 10px 0; ">
                  <p style="color: #ff8800; margin-bottom: 0px;">Đếm ngược: {{ hour
                    < 10 ? '0' + hour : hour }}:{{ minute < 10 ? '0' + minute : minute }}:{{ second < 10 ? '0' + second
                      : second }}</p>
                </a-col>
              </a-row>
            </div>
            <div class="user_box">
              <a-row align="middle" justify="space-between" :gutter="10">
                <a-col :md="12" :lg="12" :xl="12" :xxl="12" :sm="24" :xs="24" style="margin: 10px 0;">
                  <div class="user_code">
                    <span style="color: #fff; font-size: 16px; font-weight: bold;">
                      Ví tiền: {{ formatCurrency(user?.balance) }}
                    </span>
                  </div>
                  <div id="money_box" style="margin-top: 10px;">
                    <a-row align="middle" :gutter="10">
                      <a-col :md="4" :lg="4" :xl="4" :xxl="4" :sm="24" :xs="24" style="margin-bottom: 10px;">
                        <span style="color: #fff; font-size: 16px; font-weight: bold;">Số tiền:</span>
                      </a-col>
                      <a-col :md="10" :lg="10" :xl="10" :xxl="10" :sm="24" :xs="24" style="margin-bottom: 10px;">
                        <a-input-number :min="0" :max="user?.balance" style=" width: 100%;" v-model:value="money"
                          :formatter="formatterNumber" :parser="parserNumber" placeholder="Nhập số tiền" />
                      </a-col>
                      <a-col :md="10" :lg="10" :xl="10" :xxl="10" :sm="24" :xs="24" style="margin-bottom: 10px;">
                        <a-select :max="user?.balance" style=" width: 100%;" :options="optionMoney"
                          placeholder="Tùy chọn số tiền" @change="changeMoney" />
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
                <a-col :md="12" :lg="12" :xl="12" :xxl="12" :sm="24" :xs="24" style="margin: 10px 0; ">
                  <div class="user_code">
                    <span style="color: #fff; font-size: 16px; font-weight: bold;">
                      <UserOutlined />
                      {{ user?.code }}
                    </span>
                  </div>
                  <div id="buy_or_sell" style="margin-top: 10px;">
                    <a-row :gutter="10">
                      <a-col :md="12" :lg="12" :xl="12" :xxl="12" :sm="24" :xs="24" style="margin-bottom: 10px;">
                        <a-button type="defaut" :class="{ 'disabled': disabledMoney }"
                          style="width: 100%; background-color: #418a06; color: #fff;" @click="tradeDing('buy')"
                          :disabled="disabledMoney">Mua</a-button>
                      </a-col>
                      <a-col :md="12" :lg="12" :xl="12" :xxl="12" :sm="24" :xs="24" style="margin-bottom: 10px;">
                        <a-button type="defaut" :class="{ 'disabled': disabledMoney }"
                          style="width: 100%; background-color: #7a0d2e; color: #fff;" @click="tradeDing('sell')"
                          :disabled="disabledMoney">Bán</a-button>
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :lg="4" :xl="4" :xxl="4" :sm="24" :xs="24">
        <div id="ticker-tape">
          <div>
            <img src="@/assets/img/traffic.gif" alt="" style="width: 25px; height: 20px;">
          </div>
          <div style="display: flex; align-items: center; margin-left: 10px;">
            <span style="color: #fff; font-size: 16px; font-weight: bold;">Giao dịch của tôi</span>
          </div>
        </div>
        <div class="ticker-tape_item">
          <a-row :gutter="10" v-for="item in tradeData" :key="item._id">
            <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8">
              <p style="color: #fff; font-size: 13px;">{{ item.createdAt ? moment(item.createdAt).format('HH:mm:ss') :
                '-' }}</p>
            </a-col>
            <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8">
              <p style="font-size: 12px; color: yellow;"
                :class="{ 'up': item.status == 'success', 'down': item.status == 'failed' }">{{ item.status == 'pending'
                ? 'Đang chờ' : item.status == 'success' ? 'Thành công' : 'Thất bại' }}</p>
            </a-col>
            <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8" style="text-align: right;">
              <p style="color: #fff; font-size: 12px;">{{ item.amount ? formatCurrency(item.amount) : '-' }}</p>
            </a-col>
          </a-row>
        </div>
        <div id="ticker-tape">
          <div>
            <img src="@/assets/img/traffic.gif" alt="" style="width: 25px; height: 20px;">
          </div>
          <div style="display: flex; align-items: center; margin-left: 10px;">
            <span style="color: #fff; font-size: 16px; font-weight: bold;">Giao dịch trực tuyến</span>
          </div>
        </div>
        <div class="ticker-tape_item" style="height: 400px; overflow-y: auto; overflow-x: hidden;">
          <a-row :gutter="10" v-for="item in tradeOnline" :key="item._id" justify="space-between">
            <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8">
              <p style="color: #fff; font-size: 13px;">{{ item.createdAt ? moment(item.createdAt).format('HH:mm:ss') :
                '-' }}</p>
            </a-col>
            <!-- <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8">
              <p style="font-size: 12px; color: yellow;"
                :class="{ 'up': item.status == 'success', 'down': item.status == 'failed' }">{{ item.status == 'pending'
                ? 'Đang chờ' : item.status == 'success' ? 'Thành công' : 'Thất bại' }}</p>
            </a-col> -->
            <a-col :md="8" :lg="8" :xl="8" :xxl="8" :xs="8" style="text-align: right;">
              <p style=" font-size: 12px;" :class="{ 'up': item.type == 'buy', 'down': item.type == 'sell' }">{{
                item.type == 'buy' ? 'Mua vào' : 'Bán ra' }}</p>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.wrapper {
  background: -webkit-linear-gradient(100deg, #002a50, #001325);
  /* padding: 10px; */
  min-height: 100vh;
}
.disabled {
  background-color: #ccc !important;
  color: #fff !important;
  cursor: not-allowed !important;
}
/* .user_box {
  margin: 10px;
  border: 1px solid #58c1ff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
} */
 .user_code {
  background-color: #0a6cff47;
  padding: 10px;
  color: #fff;
  border-radius: 10px;
 }
#market_box {
  margin: 10px;
  border: 1px solid #58c1ff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.ticker-tape_up::before {
  content: "";
  margin-right: 1px;
  width: 0;
  height: 0;
  border-width: 0 4px 8px 4px;
  border-style: solid;
  border-color: transparent transparent #73ff00 transparent;
  position: absolute;
  top: 5px;
  left: 0;
}

.up {
  color: #73ff00 !important;
}

.ticker-tape_down::before {
  content: "";
  margin-right: 1px;
  width: 0;
  height: 0;
  border-width: 0 4px 8px 4px;
  border-style: solid;
  border-color: transparent transparent #f81057 transparent;
}

.down {
  color: #f81057 !important;
}

header {
  width: 100%;
  /* height: 50px; */
  background-color: #1a0d40;
}

.ticker-tape_item {
  margin: 10px;
}

.ticker-tape_item p {
  color: #fff;
}

#ticker-tape {
  color: #fff;
  background-color: #042c68;
  text-align: center;
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
}

#ticker-tape p {
  margin: 0;
  color: #fff;
}

.tradingview-widget-container {
  background-color: #001f3b;
  height: 60px;
}

.tradingview-widget-copyright {
  font-size: 13px !important;
  line-height: 32px !important;
  text-align: center !important;
  vertical-align: middle !important;
  /* @mixin sf-pro-display-font; */
  font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
  color: #B2B5BE !important;
}

.tradingview-widget-copyright .blue-text {
  color: #2962FF !important;
}

.tradingview-widget-copyright a {
  text-decoration: none !important;
  color: #B2B5BE !important;
}

.tradingview-widget-copyright a:visited {
  color: #B2B5BE !important;
}

.tradingview-widget-copyright a:hover .blue-text {
  color: #1E53E5 !important;
}

.tradingview-widget-copyright a:active .blue-text {
  color: #1848CC !important;
}

.tradingview-widget-copyright a:visited .blue-text {
  color: #2962FF !important;
}

/* Add your custom styles here */
</style>