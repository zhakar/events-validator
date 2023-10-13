import { EventsValidatorService } from './eventsValidatorService.js';
import json from './testData.json' assert { type: 'json' };

const RewardTypes = ['coins', 'spins', 'pet_xp', 'chest'];
const expectedKeys = ['type', 'value'];

const eventsValidator = new EventsValidatorService('complete_village', RewardTypes, expectedKeys);
console.log(eventsValidator.validateEvents(json));
