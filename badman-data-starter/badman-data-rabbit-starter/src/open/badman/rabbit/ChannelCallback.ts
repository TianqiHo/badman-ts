

import {Channel, ConfirmChannel} from "amqplib";


export default interface ChannelCallback {

	doInChannel (channel: Channel);

	doInChannel (channel: ConfirmChannel);

	doInChannel (channel: Channel, ...arg: any[]);

	doInChannel (channel: ConfirmChannel, ...arg: any[]);
}