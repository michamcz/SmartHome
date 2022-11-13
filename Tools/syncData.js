
import { mergeItem } from "../DataHandle/handleConfigData";
import RGBToHex from "./RGBToHex"

export default async function syncData(devObject) {
  try {
    const response = await fetch(`http://${devObject.ip}/GETDATA`)
    //console.log(response)
    if (!response.ok) {
      throw new Error('not connected')
    }
    else {
      const data = await response.json()
      //console.log('GETDATA')
      //console.log(data)
      if (JSON.stringify(data.whatAmI) == 1) {   //stepper motor/curtains
        await mergeItem(devObject.name, {
          type: JSON.stringify(data.whatAmI) || '0',
          maxStep: JSON.stringify(data.maxStep),
          speed: 14 - JSON.stringify(data.speed),
          Mon: (data.MoOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.MoOpenHour, data.MoOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.MoCloseHour, data.MoCloseMin, 0),
            },
          Tue: (data.TuOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.TuOpenHour, data.TuOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.TuCloseHour, data.TuCloseMin, 0),
            },
          Wed: (data.WeOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.WeOpenHour, data.WeOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.WeCloseHour, data.WeCloseMin, 0),
            },
          Thu: (data.ThOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.ThOpenHour, data.ThOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.ThCloseHour, data.ThCloseMin, 0),
            },
          Fri: (data.FrOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.FrOpenHour, data.FrOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.FrCloseHour, data.FrCloseMin, 0),
            },
          Sat: (data.SaOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.SaOpenHour, data.SaOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.SaCloseHour, data.SaCloseMin, 0),
            },
          Sun: (data.SuOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.SuOpenHour, data.SuOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.SuCloseHour, data.SuCloseMin, 0),
            },
        })
        return true
      }
      else if (JSON.stringify(data.whatAmI) == 2) {    //WS2812B
        await mergeItem(devObject.name, {
          type: JSON.stringify(data.whatAmI) || '0',
          effect: JSON.stringify(data.currentPattern) || '1',
          color: RGBToHex(data.currentRedColor, data.currentGreenColor, data.currentBlueColor) || '#FF0000',
          palette: JSON.stringify(data.currentPaleete) || '0',
          brightness: JSON.stringify(data.currentBrightness) || '100',
          amountLed: JSON.stringify(data.currentAmountLed) || '60',
          speed: JSON.stringify(data.currentSpeed) || '20',
        })
        return true
      }
      else if (JSON.stringify(data.whatAmI) == 3) {   //relay
        await mergeItem(devObject.name, {
          type: JSON.stringify(data.whatAmI) || '0',
          Mon: (data.MoOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.MoOpenHour, data.MoOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.MoCloseHour, data.MoCloseMin, 0),
            },
          Tue: (data.TuOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.TuOpenHour, data.TuOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.TuCloseHour, data.TuCloseMin, 0),
            },
          Wed: (data.WeOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.WeOpenHour, data.WeOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.WeCloseHour, data.WeCloseMin, 0),
            },
          Thu: (data.ThOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.ThOpenHour, data.ThOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.ThCloseHour, data.ThCloseMin, 0),
            },
          Fri: (data.FrOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.FrOpenHour, data.FrOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.FrCloseHour, data.FrCloseMin, 0),
            },
          Sat: (data.SaOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.SaOpenHour, data.SaOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.SaCloseHour, data.SaCloseMin, 0),
            },
          Sun: (data.SuOpenHour > 60) ?
            {
              active: false,
            } : {
              active: true,
              dateOpen: new Date(1995, 11, 17, data.SuOpenHour, data.SuOpenMin, 0),
              dateClose: new Date(1995, 11, 17, data.SuCloseHour, data.SuCloseMin, 0),
            },
        })
        return true
      }
      else if (JSON.stringify(data.whatAmI) == 4) {
        await mergeItem(devObject.name, {
          type: JSON.stringify(data.whatAmI) || '0',
        })
        return true
      }
    }
  }
  catch (e) {
    console.log('syncData error ', e)
    return false
  }
}