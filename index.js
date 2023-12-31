import { EventRewardKeys } from './constants/eventRewardKeys.js';
import { EventRewardTypes } from './constants/eventRewardTypes.js';
import { EventTypes } from './constants/eventTypes.js';
import { EventsValidatorService } from './eventsValidatorService.js';

const json ='{"events":[{"event_name":"Complete Village Spring 33","event_type":"complete_village","startTime":"2033-04-10T23:50:21.817Z","endsTime":"2033-05-10T23:50:21.817Z","rewards":[{"value":10000,"type":"coins"},{"value":100,"type":"spins"},{"value":"foxy_chest","type":"chest"}]},{"event_name":"Complete Village Winter 23","event_type":"complete_village","startTime":"2023-01-12T23:50:21.817Z","endsTime":"2023-01-13T23:50:21.817Z","rewards":[{"value":1000,"type":"coins"},{"value":450,"type":"spins"},{"value":2000,"type":"pet_xp"}]},{"event_name":"Raid Mania Summer 33","event_type":"raid_mania","startTime":"2033-07-10T23:50:21.817Z","endsTime":"2033-08-10T23:50:21.817Z","rewards":[{"value":10000,"type":"coins"},{"value":500,"type":"spins"},{"value":3000,"type":"pet_xp"}]},{"event_name":"Complete Village Spring 33","event_type":"complete_village","startTime":"2033-06-10T23:50:21.817Z","endsTime":"2033-07-10T23:50:21.817Z","rewards":[{"value":10000,"type":"coins"},{"value":100,"type":"spins"},{"value":600,"type":"pet_xp"}]}],"rewardsConfig":{"chests":{"piggy_chest":{"cards":2,"spins":50,"coins":500},"foxy_chest":{"cards":4,"spins":150,"petXp":200},"rhino_chest":{"cards":6,"spins":300,"coins":10000},"bear_chest":{"cards":8,"spins":500,"coins":30000},"lion_chest":{"cards":10,"spins":1000,"coins":50000}}}}';
const rewardThresholds = {
  spins: 400,
  coins: 100000,
  pet_xp: 1000,
};
const eventsValidator = new EventsValidatorService(
  EventTypes.COMPLETE_VILLAGE,
  EventRewardTypes[EventTypes.COMPLETE_VILLAGE],
  EventRewardKeys[EventTypes.COMPLETE_VILLAGE],
  rewardThresholds
);

const errorsArray = eventsValidator.validateEvents(json);
console.log('Array of errors:');
console.log(errorsArray);