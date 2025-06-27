import xrpl
from xrpl.models.transactions import NFTokenMint, NFTokenCreateOffer, NFTokenAcceptOffer
from xrpl.models.requests import AccountNFTs
from xrpl.utils import str_to_hex
import json
import os


class XRPLService:
    def __init__(self):
        # Use testnet for development
        self.client = xrpl.clients.JsonRpcClient("https://s.altnet.rippletest.net:51234/")
        # For production, use mainnet:
        # self.client = xrpl.clients.JsonRpcClient("https://xrplcluster.com/")
        
        # Platform wallet for minting NFTs
        # In production, store these securely (environment variables, vault, etc.)
        self.platform_seed = os.getenv('XRPL_PLATFORM_SEED', 'sEdTM1uX8pu2do5XvTnutH6HsouMaM2')
        self.platform_wallet = xrpl.wallet.Wallet.from_seed(self.platform_seed)
    
    def mint_ticket_nft(self, event_title, event_date, event_location, ticket_id, user_wallet_address):
        """
        Mint an NFT ticket for an event
        """
        try:
            # Create metadata for the NFT
            metadata = {
                "event": event_title,
                "date": event_date,
                "location": event_location,
                "ticket_id": str(ticket_id),
                "type": "Event Ticket",
                "platform": "RippleGate"
            }
            
            # Convert metadata to hex
            metadata_hex = str_to_hex(json.dumps(metadata))
            
            # Create NFT mint transaction
            mint_tx = NFTokenMint(
                account=self.platform_wallet.classic_address,
                nftoken_taxon=0,
                flags=1,  # tfTransferable - allows the NFT to be transferred
                uri=metadata_hex,
            )
            
            # Submit and wait for transaction
            response = xrpl.transaction.submit_and_wait(mint_tx, self.client, self.platform_wallet)
            
            if response.result.get('validated') and response.result.get('meta', {}).get('TransactionResult') == 'tesSUCCESS':
                # Extract the NFT ID from the transaction metadata
                nft_id = self._extract_nft_id_from_response(response)
                
                if nft_id and user_wallet_address != self.platform_wallet.classic_address:
                    # Transfer NFT to user
                    transfer_success = self.transfer_nft_to_user(nft_id, user_wallet_address)
                    if transfer_success:
                        return {
                            'success': True,
                            'nft_id': nft_id,
                            'transaction_hash': response.result['hash'],
                            'metadata': metadata
                        }
                    else:
                        return {
                            'success': False,
                            'error': 'NFT minted but transfer failed'
                        }
                else:
                    return {
                        'success': True,
                        'nft_id': nft_id,
                        'transaction_hash': response.result['hash'],
                        'metadata': metadata
                    }
            else:
                return {
                    'success': False,
                    'error': f"Transaction failed: {response.result.get('meta', {}).get('TransactionResult', 'Unknown error')}"
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def transfer_nft_to_user(self, nft_id, user_wallet_address):
        """
        Transfer NFT from platform wallet to user wallet
        """
        try:
            # Create sell offer for 0 XRP (free transfer)
            sell_offer_tx = NFTokenCreateOffer(
                account=self.platform_wallet.classic_address,
                nftoken_id=nft_id,
                amount="0",
                destination=user_wallet_address,
                flags=1  # tfSellNFToken
            )
            
            # Submit sell offer
            sell_response = xrpl.transaction.submit_and_wait(sell_offer_tx, self.client, self.platform_wallet)
            
            if sell_response.result.get('validated') and sell_response.result.get('meta', {}).get('TransactionResult') == 'tesSUCCESS':
                return True
            else:
                return False
                
        except Exception as e:
            print(f"Transfer error: {str(e)}")
            return False
    
    def _extract_nft_id_from_response(self, response):
        """
        Extract NFT ID from mint transaction response
        """
        try:
            meta = response.result.get('meta', {})
            created_nodes = meta.get('CreatedNodes', [])
            
            for node in created_nodes:
                if node.get('CreatedNode', {}).get('LedgerEntryType') == 'NFTokenPage':
                    nftoken_page = node.get('CreatedNode', {}).get('NewFields', {})
                    nftokens = nftoken_page.get('NFTokens', [])
                    if nftokens:
                        return nftokens[0].get('NFToken', {}).get('NFTokenID')
            
            return None
        except Exception as e:
            print(f"Error extracting NFT ID: {str(e)}")
            return None
    
    def get_user_nfts(self, wallet_address):
        """
        Get all NFTs owned by a wallet address
        """
        try:
            request = AccountNFTs(account=wallet_address)
            response = self.client.request(request)
            
            if response.is_successful():
                return {
                    'success': True,
                    'nfts': response.result.get('account_nfts', [])
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to fetch NFTs'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_nft_ownership(self, nft_id, wallet_address):
        """
        Verify if a wallet owns a specific NFT
        """
        try:
            user_nfts = self.get_user_nfts(wallet_address)
            if user_nfts['success']:
                for nft in user_nfts['nfts']:
                    if nft.get('NFTokenID') == nft_id:
                        return True
            return False
        except Exception as e:
            print(f"Error verifying NFT ownership: {str(e)}")
            return False
