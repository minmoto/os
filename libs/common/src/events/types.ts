import {
  NotificationChannel,
  NotificationImportance,
  NotificationTopic,
  TransactionStatus,
} from '../types';

// Scenarios in which onramp swap can receive payment
export enum FedimintContext {
  OFFRAMP_RECEIVE,
  SOLOWALLET_RECEIVE,
  CHAMAWALLET_RECEIVE,
}

export interface FedimintReceiveSuccessEvent {
  operationId: string;
  context: FedimintContext;
}

export interface FedimintReceiveFailureEvent {
  operationId: string;
  context: FedimintContext;
  error?: string;
}

export enum SwapContext {
  ONRAMP,
  OFFRAMP,
}

export interface SwapStatusChangePayload {
  swapTracker: string;
  swapStatus: TransactionStatus;
  refundable?: boolean;
}

export interface SwapStatusChangeEvent {
  context: SwapContext;
  payload: SwapStatusChangePayload;
  error?: string;
}

export enum WalletTxContext {
  COLLECTION_FOR_SHARES,
}

interface WalletTxEventPayload {
  paymentTracker: string;
  paymentStatus: TransactionStatus;
}

export interface WalletTxEvent {
  context: WalletTxContext;
  payload: WalletTxEventPayload;
  error?: string;
}

// Notification Events
export interface NotificationCreatedEvent {
  notificationId: string;
  userId: string;
  title: string;
  body: string;
  topic: NotificationTopic;
  importance: NotificationImportance;
  channels: NotificationChannel[];
  metadata?: Record<string, string>;
}

export interface NotificationDeliveredEvent {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  success: boolean;
  error?: string;
}

export interface NotificationPreferencesUpdatedEvent {
  userId: string;
}
