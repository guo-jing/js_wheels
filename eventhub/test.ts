import Eventhub from './eventhub';

const test1 = () => {
    const eventhub = new Eventhub();
    eventhub.on('eventName', () => {
        console.assert(true)
    });
    eventhub.emit('eventName');
};

const test2 = () => {
    const eventhub = new Eventhub();
    let called = false;
    eventhub.on('eventName', () => {
        called = true;
    });
    eventhub.off('eventName');
    eventhub.emit('eventName');
    console.assert(called === false);
};

test1();
test2();