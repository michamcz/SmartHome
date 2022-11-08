import parseDate from '../Tools/parseDate'

export function sendConfigRequest(config) {
  const { ssid, pass, ip, gateway, mask } = config

  const ipArr = ip.split('.')
  const gatewayArr = gateway.split('.')
  const maskArr = mask.split('.')

  const request = `http://192.168.4.1/UPDATE?ssid=${ssid}&password=${pass}&ipA=${ipArr[0]}&ipB=${ipArr[1]}&ipC=${ipArr[2]}&ipD=${ipArr[3]}&gateA=${gatewayArr[0]}&gateB=${gatewayArr[1]}&gateC=${gatewayArr[2]}&gateD=${gatewayArr[3]}&maskA=${maskArr[0]}&maskB=${maskArr[1]}&maskC=${maskArr[2]}&maskD=${maskArr[3]}`

  fetch(request)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('RequestConfigError', error)
    });
}

export function sendConfigStepSpeed(config) {
  const { maxStep, speed, ip } = config

  const requestSpeed = `http://${ip}/SPEED?speed=${speed}`
  const requestStep = `http://${ip}/SET?maxstep=${maxStep}`
  //console.log(requestStep)

  fetch(requestSpeed)
    .then(response => console.log(response))
    .catch((error) => {
      console.error('SpeedConfigError', error)
    });

  fetch(requestStep)
    .then(response => console.log(response))
    .catch((error) => {
      console.error('MaxStepConfigError', error)
    });
}

export function sendConfigLedCount(config) {
  const { ledCount, ip } = config

  const requestLedCount = `http://${ip}/AMOUNTLED?amountLed=${ledCount}`
  //console.log(requestLedCount)
  fetch(requestLedCount)
    .then(response => console.log(response))
    .catch((error) => {
      console.error('LedCountConfigError', error)
    });
}

export function sendDayOpenCloseConfig(config) {
  const { Mon, Tue, Wed, Thu, Fri, Sat, Sun, ip } = config;
  const weekTable = [Sun, Mon, Tue, Wed, Thu, Fri, Sat]

  weekTable.map((day, i) => {
    const openH = parseDate(new Date(day.dateOpen))[1]
    const openM = parseDate(new Date(day.dateOpen))[2]
    const closeH = parseDate(new Date(day.dateClose))[1]
    const closeM = parseDate(new Date(day.dateClose))[2]
    let requestDay = '';

    if (day.active) {
      requestDay = `http://${ip}/CALENDAR?day=${i}&openH=${openH}&openM=${openM}&closeH=${closeH}&closeM=${closeM}`
    }
    else {
      requestDay = `http://${ip}/CALENDAR?day=${i}&openH=66&openM=66&closeH=66&closeM=66`
    }
    //console.log(requestDay)
    fetch(requestDay)
      .then(response => console.log(response))
      .catch((error) => {
        console.error('DayCalendarConfigError', error)
      });
  })
}
