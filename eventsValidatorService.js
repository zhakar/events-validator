import { assert } from 'chai';
import { Logger } from './utils/Logger.js';
import { parseJSONFromString } from './utils/utils.js';
import { EventTypes } from './constants/eventTypes.js';

export class EventsValidatorService {
  constructor(eventType, rewardTypes, expectedKeys, thresholds) {
    this.eventType = eventType;
    this.rewardTypes = rewardTypes;
    this.expectedKeys = expectedKeys;
    this.thresholds = thresholds;
    this.errorMessages = [];
  }

  #getEvents(json) {
    const currentDate = new Date();
    switch (this.eventType) {
      case EventTypes.COMPLETE_VILLAGE:
        return json.events.filter(
          (event) => event.event_type === this.eventType && new Date(event.startTime) > currentDate
        );
      default:
        Logger.error('Event is not implemented');
        return null;
    }
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
          isSuccessful = false;
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
            isSuccessful = false;
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

  #validateThresholds(events, rewardsConfig) {
    Logger.info('Validating thresholds');
    let isSuccessful = true;
    for (const event of events) {
      const totalReward = {
        spins: 0,
        coins: 0,
        pet_xp: 0,
      };
      for (const reward of event.rewards) {
        if (reward.type !== 'chest') {
          if (reward.type in totalReward) {
            totalReward[reward.type] += reward.value;
          } else {
            totalReward[reward.type] = reward.value;
          }
        } else {
          const chestContent = rewardsConfig.chests[reward.value];
          for (const key in chestContent) {
            if (!(key in totalReward)) totalReward[key] = chestContent[key];
            else {
              totalReward[key] += chestContent[key];
            }
          }
        }
      }
      if ('petXp' in totalReward) {
        totalReward.pet_xp += totalReward.petXp;
        delete totalReward.petXp;
      }
      for (const threshold in this.thresholds) {
        if (threshold in totalReward) {
          try {
            assert.isAtMost(
              totalReward[threshold],
              this.thresholds[threshold],
              `Total ${threshold} amount should be at most ${this.thresholds[threshold]}. Actual amount: ${totalReward[threshold]}`
            );
          } catch (err) {
            isSuccessful = false;
            Logger.error(err.message);
            this.errorMessages.push(err.message);
          }
        }
      }
    }
    if (isSuccessful) Logger.info('Reward thresholds validation is successful');
    else {
      Logger.error('Reward thresholds validation finished with errors');
    }
  }

  validateEvents(jsonString) {
    const json = parseJSONFromString(jsonString);
    if (!json) {
      Logger.error('Unable to parse JSON');
      return null;
    }
    const events = this.#getEvents(json);
    if (events) {
      const rewardsConfig = this.#getRewardsConfig(json);
      this.#validateRewardTypes(events);
      this.#validateEventKeys(events);
      this.#validateChests(events, rewardsConfig);
      this.#validateThresholds(events, rewardsConfig);
      return this.errorMessages;
    }
  }
}
