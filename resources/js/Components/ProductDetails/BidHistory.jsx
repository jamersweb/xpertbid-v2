import Price from "@/Components/Price";

export default function BidHistory({ bids }) {
       const defaultProfileImage = "/assets/images/user.jpg";

       const getUrl = (path) => {
              if (!path) return defaultProfileImage;
              if (path.startsWith('http')) return path;
              const cleanPath = path.startsWith('/') ? path.slice(1) : path;
              return `https://admin.xpertbid.com/${cleanPath}`;
       };

       return (
              <div className="bid-history-parent">
                     <div className="bid-history-header">
                            <h2 className="description">Bid History</h2>
                     </div>
                     <div className="bid-history-scroll">
                            {Array.isArray(bids) && bids.length > 0 ? (
                                   bids.map((bid) => {
                                          const user = bid.user || {};
                                          const userImage = user.profile_pic || user.image;
                                          const img = getUrl(userImage);

                                          const amountAED = Number(bid.bid_amount || bid.amount) || 0;
                                          const dateStr = new Date(bid.created_at).toLocaleString(undefined, {
                                                 day: 'numeric',
                                                 month: 'short',
                                                 year: 'numeric',
                                                 hour: '2-digit',
                                                 minute: '2-digit'
                                          });

                                          return (
                                                 <div className="history-user parent" key={bid.id}>
                                                        <div className="history-user-profile">
                                                               <img
                                                                      src={img}
                                                                      alt="Bidder"
                                                                      referrerPolicy="no-referrer"
                                                                      style={{
                                                                             width: "30px",
                                                                             height: "30px",
                                                                             borderRadius: "40%",
                                                                             objectFit: "cover",
                                                                      }}
                                                                      onError={(e) => { e.target.src = defaultProfileImage; }}
                                                               />

                                                               <div className="username-and-date ms-3">
                                                                      <p className="history-user-name">
                                                                             {user.name ? (user.name.length > 15 ? user.name.substring(0, 15) + "..." : user.name) : 'Unknown'}
                                                                      </p>
                                                                      <span className="date">{dateStr}</span>
                                                               </div>
                                                        </div>

                                                        <div className="history-user-payAmount">
                                                               <p className="history-no">
                                                                      <Price amountAED={amountAED} />
                                                               </p>
                                                        </div>
                                                 </div>
                                          );
                                   })
                            ) : (
                                   <p className="text-center text-muted my-4">No Bid History</p>
                            )}
                     </div>
              </div>
       );
}
