import { useEffect, useReducer, useRef, useCallback } from 'react'
import noop from 'lodash/noop'
import { useWeb3React } from '@web3-react/core'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import useCatchTxError from './useCatchTxError'

type LoadingState = 'idle' | 'loading' | 'success' | 'fail' | 'require'

type Action =
  | { type: 'approve_sending' }
  | { type: 'approve_receipt' }
  | { type: 'approve_error' }
  | { type: 'confirm_sending' }
  | { type: 'confirm_receipt' }
  | { type: 'approve_require' }
  | { type: 'confirm_error' }

interface State {
  approvalState: LoadingState
  confirmState: LoadingState
}

const initialState: State = {
  approvalState: 'idle',
  confirmState: 'idle',
}

const reducer = (state: State, actions: Action): State => {
  switch (actions.type) {
    case 'approve_sending':
      return {
        ...state,
        approvalState: 'loading',
      }

    case 'approve_require':
      return {
        ...state,
        approvalState: 'require',
      }

    case 'approve_receipt':
      return {
        ...state,
        approvalState: 'success',
      }
    case 'approve_error':
      return {
        ...state,
        approvalState: 'fail',
      }
    case 'confirm_sending':
      return {
        ...state,
        confirmState: 'loading',
      }
    case 'confirm_receipt':
      return {
        ...state,
        confirmState: 'success',
      }
    case 'confirm_error':
      return {
        ...state,
        confirmState: 'fail',
      }
    default:
      return state
  }
}

interface OnSuccessProps {
  state: State
  receipt: TransactionReceipt
}

interface ApproveConfirmTransaction {
  onApprove: () => Promise<TransactionResponse>
  onConfirm?: (params?: any) => Promise<TransactionResponse>
  onRequiresApproval?: () => Promise<boolean>
  onSuccess: ({ state, receipt }: OnSuccessProps) => void
  onApproveSuccess?: ({ state, receipt }: OnSuccessProps) => void
}

const useApproveConfirmTransaction = ({
  onApprove,
  onConfirm,
  onRequiresApproval,
  onSuccess = noop,
  onApproveSuccess = noop,
}: ApproveConfirmTransaction) => {
  const { account } = useWeb3React()
  const [state, dispatch] = useReducer(reducer, initialState)
  const handlePreApprove = useRef(onRequiresApproval)
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      dispatch({ type: 'approve_sending' })
      return onApprove()
    })
    if (receipt?.status) {
      dispatch({ type: 'approve_receipt' })
      onApproveSuccess({ state, receipt })
    } else {
      dispatch({ type: 'approve_error' })
    }
  }, [onApprove, onApproveSuccess, state, fetchWithCatchTxError])

  // const handleConfirm = useCallback(
  //   async (params = {}) => {
  //     const receipt = await fetchWithCatchTxError(() => {
  //       dispatch({ type: 'confirm_sending' })
  //       return onConfirm(params)
  //     })
  //     if (receipt?.status) {
  //       dispatch({ type: 'confirm_receipt' })
  //       onSuccess({ state, receipt })
  //     } else {
  //       dispatch({ type: 'confirm_error' })
  //     }
  //   },
  //   [onConfirm, dispatch, onSuccess, state, fetchWithCatchTxError]
  // )

  // Check if approval is necessary, re-check if account changes
  useEffect(() => {
    if (account && handlePreApprove.current) {
      handlePreApprove.current().then((requiresApproval) => {
        if (requiresApproval) {
          dispatch({ type: 'approve_require' })
        } else {
          dispatch({ type: 'approve_receipt' })
        }
      })
    }
  }, [account, handlePreApprove, dispatch])

  return {
    isWait: state.approvalState == 'idle',
    isApproving: state.approvalState === 'loading',
    isApproved: state.approvalState === 'success',
    isConfirming: state.confirmState === 'loading',
    isConfirmed: state.confirmState === 'success',
    hasApproveFailed: state.approvalState === 'fail',
    hasConfirmFailed: state.confirmState === 'fail',
    handleApprove,
    // handleConfirm,
  }
}

export default useApproveConfirmTransaction

// const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
// useApproveConfirmTransaction({
//   onRequiresApproval: async () => {
//     return requiresApproval(cakeContractReader, account, farmAuctionContract.address)
//   },
//   onApprove: () => {
//     return callWithGasPrice(cakeContractApprover, 'approve', [farmAuctionContract.address, MaxUint256])
//   },
//   onApproveSuccess: async ({ receipt }) => {
//     toastSuccess(
//       t('Contract approved - you can now place your bid!'),
//       <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
//     )
//   },
//   onConfirm: () => {
//     const bidAmount = new BigNumber(bid).times(DEFAULT_TOKEN_DECIMAL).toString()
//     return callWithGasPrice(farmAuctionContract, 'bid', [bidAmount])
//   },
//   onSuccess: async ({ receipt }) => {
//     refreshBidders()
//     onDismiss?.()
//     toastSuccess(t('Bid placed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
//   },
// })
