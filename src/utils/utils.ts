export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  // Radius of the Earth in kilometers
  const earthRadius = 6371; // in kilometers

  // Convert latitude and longitude from degrees to radians
  const radiansLat1 = (lat1 * Math.PI) / 180;
  const radiansLon1 = (lon1 * Math.PI) / 180;
  const radiansLat2 = (lat2 * Math.PI) / 180;
  const radiansLon2 = (lon2 * Math.PI) / 180;

  // Differences in latitude and longitude
  const dLat = radiansLat2 - radiansLat1;
  const dLon = radiansLon2 - radiansLon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadius * c;

  return distance;
}

export function formatNumberToCurrency(
  number: number,
  currencySymbol: string
  // decimalSeparator = ".",
  // thousandsSeparator = ","
) {
  if (isNaN(number)) {
    return "Invalid number";
  }

  const options = {
    // minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formattedNumber = new Intl.NumberFormat(undefined, options).format(
    number
  );

  return `${currencySymbol} ${formattedNumber}`;
}

export const getStatus = (open: string, close: string) => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  if (open < time && time < close) {
    return "Đang mở cửa";
  } else {
    return "Đã đóng cửa";
  }
};

export const getDMY = (timestamp: any) => {
  const date = new Date(timestamp.seconds * 1000);
  const d = date.getDay();
  const m = date.getMonth();
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export function removeDau(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
