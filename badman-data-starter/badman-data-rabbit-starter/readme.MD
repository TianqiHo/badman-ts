

Rabbit AMQP0.9 MiddleSoft

Demo API:

Declare Instances:

    export default class DemoConsumer implements RabbitConsumer<Channel, ConsumeMessage>{

        private rabbitAdminTemplate:RabbitAdminTemplate;

        constructor () {
            this.rabbitAdminTemplate = SingletonObjectFactory2.Instance<RabbitAdminTemplate>(RabbitAdminTemplate.name);
        }

        async consume (channel: Channel, message: ConsumeMessage): Promise<void> {
    
                try {
                    doSometing();
                } catch (e) {
                    this.logger.debug('Error->',e);
                }
            return ;
        }

       
    }



    export default class DemoConsumer implements RabbitConsumer<Channel, ConsumeMessage>{

         private rabbitTemplate:RabbitTemplate

         constructor () {
            this.rabbitTemplate = SingletonObjectFactory2.Instance<RabbitTemplate>(RabbitTemplate.name);
         }

         send(){
            this.rabbitTemplate.send(......);
         }

    }


    async loadRabbit(){

        this.logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,['log4js_properties.json']);

        let rabbitProperties:RabbitProperties = {};

        let rabbitConnectionFactory:RabbitConnectionFactory = await SingletonObjectFactory2.initWithArgs<AmqpConnectionFactory>(AmqpConnectionFactory,
            [rabbitProperties,this.logging.logger(AmqpConnectionFactory.name)]);

        this.rabbitAdminTemplate = await SingletonObjectFactory2.initWithArgs<RabbitAdminTemplate>(RabbitAdminTemplate,
            [this.logging.logger(RabbitAdminTemplate.name),rabbitConnectionFactory]);

        this.rabbitTemplate = await SingletonObjectFactory2.initWithArgs<RabbitTemplate>(RabbitTemplate,
            [this.logging.logger(RabbitTemplate.name),rabbitConnectionFactory]);

        this.rabbitAdminTemplate.declareAckConsumer('queueName',new DemoConsumer());
    }




   