import { assert } from 'chai';
import { Logger } from './utils/Logger.js';

export class EventsValidatorService {
  constructor(eventType, rewardTypes, expectedKeys, thresholds) {
    this.eventType = eventType;
    this.rewardTypes = rewardTypes;
    this.expectedKeys = expectedKeys;
    this.errorMessages = [];
  }

  #getEvents(json) {
    const currentDate = new Date();
    return json.events.filter(
      (event) => event.event_type === this.eventType && new Date(event.startTime) > currentDate
    );
  }

  #getRewardsConfig(json) {
    return json.rewardsConfig;
  }

  #validateRewardTypes(events) {
    Logger.info('Validating types of rewards');
    let isSuccessful = true;
    for (const event of events) {
      event.rewards.map((reward) => {
        try {
          assert.oneOf(
            reward.type,
            this.rewardTypes,
            `Reward type should be one of following: ${this.rewardTypes}. Actual reward type: ${reward.type}`
          );
        } catch (err) {
          isSuccessful = false;
          Logger.error(err.message);
          this.errorMessages.push(err.message);
        }
      });
    }
    if (isSuccessful) Logger.info('Rewards types validation is successful');
    else {
      Logger.error('Rewards type validation finished with errors');
    }
  }

  #validateEventKeys(events) {
    Logger.info('Validating event keys');
    let isSuccessful = true;
    for (const event of events) {
      event.rewards.map((reward) => {
        try {
          assert.hasAllKeys(
            reward,
            this.expectedKeys,
            `Expected reward to have keys ${this.expectedKeys}. Actual keys: ${Object.keys(reward)}`
          );
        } catch (err) {
          Logger.error(err.message);
          this.errorMessages.push(err.message);
        }
      });
    }
    if (isSuccessful) Logger.info('Event keys validation is successful');
    else {
      Logger.error('Event keys validation finished with errors');
    }
  }

  #validateChests(events, rewardsConfig) {
    Logger.info('Validating chests configuration');
    let isSuccessful = true;
    for (const event of events) {
      event.rewards.map((reward) => {
        if (reward.type === 'chest') {
          try {
            assert.hasAnyKeys(
              rewardsConfig.chests,
              reward.value,
              `Expected config to have value ${reward.value}. Value was not found in config!`
            );
          } catch (err) {
            Logger.error(err.message);
            this.errorMessages.push(err.message);
          }
        }
      });
    }
    if (isSuccessful) Logger.info('Chests configuration validation is successful');
    else {
      Logger.error('Chests configuration validation finished with errors');
    }
  }

  validateEvents(json) {
    const events = this.#getEvents(json);
    const rewardsConfig = this.#getRewardsConfig(json);
    this.#validateRewardTypes(events);
    this.#validateEventKeys(events);
    this.#validateChests(events, rewardsConfig);
    return this.errorMessages;
  }
}
