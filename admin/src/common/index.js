import moment from 'moment';
export const formatCurrency = (value) => {
    if (!value) return 0;
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const staticUrl = import.meta.env.VITE_API_URL;
export const getStaticFile = (url) => {
    if (!url) return '';

    const urlRe = url.replace('public', '');
    console.log(urlRe);

    return staticUrl + urlRe;
}


export const parserNumber = (val) => {
    if (!val) return 0;
    return Number.parseFloat(val.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")).toFixed(2)
}

export const formatterNumber = (val) => {
    if (!val) return 0;
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{0,2}$)/g, ",");
}

export const formatDateTime = (date) => {
    if (!date) return moment().format("YYYY-MM-DD HH:mm:ss");
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};