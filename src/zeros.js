const getDate = () => {
    const trailing = (d) => ('0' + d).slice(-2);
    const now = new Date();
    return `${now.getFullYear()}-${trailing(now.getMonth() + 1)}-${trailing(now.getDate())} ${trailing(now.getHours())}:${trailing(now.getMinutes())}:${trailing(now.getSeconds())}`;
}