import moment from 'moment';

export default {
    name: (user) => `${user.last_name} ${user.first_name}`,
    phone: (user) => user.phone.replaceAll(/[^\d]/g, ''),
    person: (user) => ({ firstName: user.first_name, lastName: user.last_name }),
    amount: (user) => parseFloat(user.amount),
    date: (user) => moment(user.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    costCenterNum: (user) => user.cc.replaceAll(/[^\d]/g, ''),
}
