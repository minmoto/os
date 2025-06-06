// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v3.20.3
// source: chamawallet.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  Bolt11,
  FindTxRequest,
  FmLightning,
  LnUrlWithdrawRequest,
  LnUrlWithdrawResponse,
  OfframpSwapTarget,
  OnrampSwapSource,
  PaginatedRequest,
  TransactionType,
} from './lib';

export enum ChamaTxStatus {
  PENDING = 0,
  PROCESSING = 1,
  FAILED = 2,
  COMPLETE = 3,
  APPROVED = 4,
  REJECTED = 5,
  UNRECOGNIZED = -1,
}

export enum Review {
  REJECT = 0,
  APPROVE = 1,
  UNRECOGNIZED = -1,
}

export interface ChamaWalletTx {
  id: string;
  memberId: string;
  chamaId: string;
  status: ChamaTxStatus;
  amountMsats: number;
  amountFiat?: number | undefined;
  lightning: FmLightning | undefined;
  type: TransactionType;
  reviews: ChamaTxReview[];
  reference: string;
  createdAt: string;
  updatedAt?: string | undefined;
  context?: ChamaTxContext | undefined;
}

export interface ChamaTxReview {
  memberId: string;
  review: Review;
}

export interface ChamaTxContext {
  sharesSubscriptionTracker?: string | undefined;
}

export interface ChamaDepositRequest {
  memberId: string;
  chamaId: string;
  amountFiat: number;
  reference?: string | undefined;
  onramp?: OnrampSwapSource | undefined;
  context?: ChamaTxContext | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaContinueDepositRequest {
  chamaId: string;
  txId: string;
  amountFiat: number;
  reference?: string | undefined;
  onramp?: OnrampSwapSource | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaWithdrawRequest {
  memberId: string;
  chamaId: string;
  amountFiat: number;
  reference?: string | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaContinueWithdrawRequest {
  chamaId: string;
  memberId: string;
  txId: string;
  reference?: string | undefined;
  offramp?: OfframpSwapTarget | undefined;
  lightning?: Bolt11 | undefined;
  lnurlRequest?: boolean | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaTxsFilterRequest {
  memberId?: string | undefined;
  chamaId?: string | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaTxsResponse {
  txId?: string | undefined;
  ledger: PaginatedChamaTxsResponse | undefined;
  groupMeta?: ChamaTxGroupMeta | undefined;
  memberMeta?: ChamaTxMemberMeta | undefined;
}

export interface ChamaTxGroupMeta {
  groupDeposits: number;
  groupWithdrawals: number;
  groupBalance: number;
}

export interface ChamaTxMemberMeta {
  memberDeposits: number;
  memberWithdrawals: number;
  memberBalance: number;
}

export interface PaginatedChamaTxsResponse {
  transactions: ChamaWalletTx[];
  /** Current page offset */
  page: number;
  /** Number of items return per page */
  size: number;
  /** Number of pages given the current page size */
  pages: number;
}

export interface ChamaTxUpdateRequest {
  chamaId: string;
  txId: string;
  updates: ChamaTxUpdates | undefined;
  pagination?: PaginatedRequest | undefined;
}

export interface ChamaTxUpdates {
  status?: ChamaTxStatus | undefined;
  amountMsats?: number | undefined;
  reviews: ChamaTxReview[];
  reference?: string | undefined;
}

export interface ChamaTxMetaRequest {
  /** chama whose transaction meta is to be aggregated */
  chamaId: string;
  /**
   * list one or more members whose transaction meta within chama specified will be aggregated
   * if empty, we aggregate meta for all members in the chama specified by `chama_id`
   */
  selectMemberIds: string[];
  /** `true`, to skip aggregating member meta. overrides `select_member_ids` behavior */
  skipMemberMeta?: boolean | undefined;
}

export interface MemberMeta {
  /** selected member id */
  memberId: string;
  /** transaction meta for the selected member */
  memberMeta: ChamaTxMemberMeta | undefined;
}

export interface ChamaMeta {
  /** selected chama id */
  chamaId: string;
  /** transaction meta for the group */
  groupMeta: ChamaTxGroupMeta | undefined;
  /** empty if `skip_memeber_meta` is `true` */
  memberMeta: MemberMeta[];
}

export interface ChamaTxMetaResponse {
  meta: ChamaMeta | undefined;
}

export interface BulkChamaTxMetaRequest {
  /** list of chama IDs to aggregate wallet meta for */
  chamaIds: string[];
  /**
   * Optional: specific member IDs to include for each chama
   * If empty, all members of each chama will be included
   */
  selectMemberIds: string[];
  /** If true, skip member meta and only return group meta */
  skipMemberMeta?: boolean | undefined;
}

export interface BulkChamaTxMetaResponse {
  /** List of meta data for each requested chama */
  meta: ChamaMeta[];
}

export interface ChamaWalletServiceClient {
  deposit(request: ChamaDepositRequest): Observable<ChamaTxsResponse>;

  continueDeposit(
    request: ChamaContinueDepositRequest,
  ): Observable<ChamaTxsResponse>;

  requestWithdraw(request: ChamaWithdrawRequest): Observable<ChamaTxsResponse>;

  continueWithdraw(
    request: ChamaContinueWithdrawRequest,
  ): Observable<ChamaTxsResponse>;

  updateTransaction(
    request: ChamaTxUpdateRequest,
  ): Observable<ChamaTxsResponse>;

  findTransaction(request: FindTxRequest): Observable<ChamaWalletTx>;

  filterTransactions(
    request: ChamaTxsFilterRequest,
  ): Observable<PaginatedChamaTxsResponse>;

  aggregateWalletMeta(
    request: ChamaTxMetaRequest,
  ): Observable<ChamaTxMetaResponse>;

  aggregateBulkWalletMeta(
    request: BulkChamaTxMetaRequest,
  ): Observable<BulkChamaTxMetaResponse>;

  processLnUrlWithdraw(
    request: LnUrlWithdrawRequest,
  ): Observable<LnUrlWithdrawResponse>;
}

export interface ChamaWalletServiceController {
  deposit(
    request: ChamaDepositRequest,
  ):
    | Promise<ChamaTxsResponse>
    | Observable<ChamaTxsResponse>
    | ChamaTxsResponse;

  continueDeposit(
    request: ChamaContinueDepositRequest,
  ):
    | Promise<ChamaTxsResponse>
    | Observable<ChamaTxsResponse>
    | ChamaTxsResponse;

  requestWithdraw(
    request: ChamaWithdrawRequest,
  ):
    | Promise<ChamaTxsResponse>
    | Observable<ChamaTxsResponse>
    | ChamaTxsResponse;

  continueWithdraw(
    request: ChamaContinueWithdrawRequest,
  ):
    | Promise<ChamaTxsResponse>
    | Observable<ChamaTxsResponse>
    | ChamaTxsResponse;

  updateTransaction(
    request: ChamaTxUpdateRequest,
  ):
    | Promise<ChamaTxsResponse>
    | Observable<ChamaTxsResponse>
    | ChamaTxsResponse;

  findTransaction(
    request: FindTxRequest,
  ): Promise<ChamaWalletTx> | Observable<ChamaWalletTx> | ChamaWalletTx;

  filterTransactions(
    request: ChamaTxsFilterRequest,
  ):
    | Promise<PaginatedChamaTxsResponse>
    | Observable<PaginatedChamaTxsResponse>
    | PaginatedChamaTxsResponse;

  aggregateWalletMeta(
    request: ChamaTxMetaRequest,
  ):
    | Promise<ChamaTxMetaResponse>
    | Observable<ChamaTxMetaResponse>
    | ChamaTxMetaResponse;

  aggregateBulkWalletMeta(
    request: BulkChamaTxMetaRequest,
  ):
    | Promise<BulkChamaTxMetaResponse>
    | Observable<BulkChamaTxMetaResponse>
    | BulkChamaTxMetaResponse;

  processLnUrlWithdraw(
    request: LnUrlWithdrawRequest,
  ):
    | Promise<LnUrlWithdrawResponse>
    | Observable<LnUrlWithdrawResponse>
    | LnUrlWithdrawResponse;
}

export function ChamaWalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'deposit',
      'continueDeposit',
      'requestWithdraw',
      'continueWithdraw',
      'updateTransaction',
      'findTransaction',
      'filterTransactions',
      'aggregateWalletMeta',
      'aggregateBulkWalletMeta',
      'processLnUrlWithdraw',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ChamaWalletService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('ChamaWalletService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const CHAMA_WALLET_SERVICE_NAME = 'ChamaWalletService';
