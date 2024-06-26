import type { Store } from 'n3';
import type { Credentials } from '../../authentication/Credentials';
import type { AccessMap } from '../../authorization/permissions/Permissions';
import type { CONTEXT_NOTIFICATION } from './Notification';
import type { NotificationChannel } from './NotificationChannel';

/**
 * A subscription service description as based on the specification data model
 * https://solidproject.org/TR/2022/notifications-protocol-20221231#subscription-service-data-model
 */
export interface SubscriptionService {
  // eslint-disable-next-line ts/naming-convention
  '@context': [ typeof CONTEXT_NOTIFICATION ];
  id: string;
  channelType: string;
  feature: string[];
}

/**
 * A specific channel type as defined at
 * https://solidproject.org/TR/2022/notifications-protocol-20221231#notification-channel-types.
 *
 * All functions that take a {@link NotificationChannel} as input
 * only need to support channels generated by an `initChannel` on the same class.
 */
export interface NotificationChannelType {
  /**
   * Returns the {@link SubscriptionService} that describes how to subscribe to this channel type.
   */
  getDescription: () => SubscriptionService;

  /**
   * Validate and convert the input quads into a {@link NotificationChannel}.
   *
   * @param data - The input quads.
   * @param credentials - The credentials of the agent doing the request.
   */
  initChannel: (data: Store, credentials: Credentials) => Promise<NotificationChannel>;

  /**
   * Converts a {@link NotificationChannel} to a serialized JSON-LD representation.
   *
   * @param channel - The notification channel to serialize.
   */
  toJsonLd: (channel: NotificationChannel) => Promise<Record<string, unknown>>;

  /**
   * Determines which modes are required to allow the given notification channel.
   *
   * @param channel - The notification channel to verify.
   *
   * @returns The required modes.
   */
  extractModes: (channel: NotificationChannel) => Promise<AccessMap>;

  /**
   * This function will be called after the serialized channel is sent back as a response,
   * allowing for any final actions that need to happen.
   *
   * @param channel - The notification channel that is completed.
   */
  completeChannel: (channel: NotificationChannel) => Promise<void>;
}
