const TwiMLGenerator = require('../twiml.generator');

class WheelLiftTemplates {

    /**
     * Mensaje Tow Option
     */
    static colorAndModel = () => {

        const message = ` 
           Please say the color, make, and model of your vehicle.
           And press 1 when you finish recording.
        `;

        return TwiMLGenerator.generateResponseCapture(message, {
            timeout: 15,
            maxLength: 240,
            playBeep: true,
            transcribe: true,
            finishOnKey: '1',
            speechEnabled: true,
            speechTimeout: 'auto',
            afterMessage: 'Thank you for the information.',
            action: '/twiml/sub-menu/tow/lift/response/1',
            retryAction: '/twiml/sub-menu/tow/lift/retry/1'
        });
    };

    static PickupAddress = () => {

        const message = ` 
           Please say the color, make, and model of your vehicle.
           And press 1 when you finish recording.
        `;

        return TwiMLGenerator.generateResponseCapture(message, {
            timeout: 15,
            maxLength: 240,
            playBeep: true,
            transcribe: true,
            finishOnKey: '1',
            speechEnabled: true,
            speechTimeout: 'auto',
            afterMessage: 'Thank you for the information.',
            action: '/twiml/sub-menu/tow/lift/response/1',
            retryAction: '/twiml/sub-menu/tow/lift/retry/1'
        });
    };

    static NeutralState = () => {

        const message = ` 
           
        `;

        return TwiMLGenerator.generateInteractiveMenu(message, {}, {
            timeout: 15,
            numDigits: 1,
            action: '/twiml/sub-menu/tow',
            timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
        });
    };

    static TiresIssues = () => {

        const message = ` 
           
        `;

        return TwiMLGenerator.generateInteractiveMenu(message, {}, {
            timeout: 15,
            numDigits: 1,
            action: '/twiml/sub-menu/tow',
            timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
        });
    };

    static TiresIssues = () => {

        const message = ` 
           
        `;

        return TwiMLGenerator.generateInteractiveMenu(message, {}, {
            timeout: 15,
            numDigits: 1,
            action: '/twiml/sub-menu/tow',
            timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
        });
    };

    static VehiculeRoll = () => {

        const message = ` 
            
        `;

        return TwiMLGenerator.generateInteractiveMenu(message, {}, {
            timeout: 15,
            numDigits: 1,
            action: '/twiml/sub-menu/tow',
            timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
        });
    };

    
    static WithTheCar = () => {

        const message = ` 
           
        `;

        return TwiMLGenerator.generateInteractiveMenu(message, {}, {
            timeout: 15,
            numDigits: 1,
            action: '/twiml/sub-menu/tow',
            timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
        });
    };

}

module.exports = WheelLiftTemplates;