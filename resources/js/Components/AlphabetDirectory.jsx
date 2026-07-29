import React, { useMemo, useState } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getLetter(label = '') {
       const cleaned = String(label || '').trim();
       if (!cleaned) return '#';
       const first = cleaned.charAt(0).toUpperCase();
       return /[A-Z]/.test(first) ? first : '#';
}

/**
 * Alphabetical directory: A–Z filter bar + grouped multi-column name list.
 * items: [{ id, label, href? }]
 * onSelect(item) called when an item is clicked (if no href navigation preferred)
 */
export default function AlphabetDirectory({
       items = [],
       onSelect,
       emptyMessage = 'Nothing to show.',
}) {
       const [activeLetter, setActiveLetter] = useState('ALL');

       const grouped = useMemo(() => {
              const map = {};
              items.forEach((item) => {
                     const letter = getLetter(item.label);
                     if (!map[letter]) map[letter] = [];
                     map[letter].push(item);
              });

              Object.keys(map).forEach((key) => {
                     map[key].sort((a, b) => String(a.label).localeCompare(String(b.label)));
              });

              return map;
       }, [items]);

       const availableLetters = useMemo(() => {
              const keys = Object.keys(grouped);
              return keys.sort((a, b) => {
                     if (a === '#') return 1;
                     if (b === '#') return -1;
                     return a.localeCompare(b);
              });
       }, [grouped]);

       const visibleLetters = useMemo(() => {
              if (activeLetter === 'ALL') {
                     return availableLetters;
              }
              return grouped[activeLetter]?.length ? [activeLetter] : [];
       }, [activeLetter, availableLetters, grouped]);

       const handleSelectLetter = (letter) => {
              setActiveLetter(letter);
       };

       return (
              <div className="alpha-dir">
                     <div className="alpha-dir__letters" role="tablist" aria-label="Alphabet filter">
                            <button
                                   type="button"
                                   className={`alpha-dir__letter ${activeLetter === 'ALL' ? 'is-active' : ''}`}
                                   onClick={() => handleSelectLetter('ALL')}
                            >
                                   All
                            </button>
                            {LETTERS.map((letter) => {
                                   const enabled = Boolean(grouped[letter]?.length);
                                   return (
                                          <button
                                                 key={letter}
                                                 type="button"
                                                 disabled={!enabled}
                                                 className={`alpha-dir__letter ${activeLetter === letter ? 'is-active' : ''} ${!enabled ? 'is-disabled' : ''}`}
                                                 onClick={() => enabled && handleSelectLetter(letter)}
                                          >
                                                 {letter}
                                          </button>
                                   );
                            })}
                     </div>

                     <div className="alpha-dir__rule" aria-hidden="true" />

                     {items.length === 0 ? (
                            <div className="alpha-dir__empty">{emptyMessage}</div>
                     ) : visibleLetters.length === 0 ? (
                            <div className="alpha-dir__empty">No names for this letter.</div>
                     ) : (
                            <div className="alpha-dir__sections">
                                   {visibleLetters.map((letter) => (
                                          <section key={letter} className="alpha-dir__section" id={`alpha-${letter}`}>
                                                 <div className="alpha-dir__section-letter" aria-hidden="true">
                                                        {letter}
                                                 </div>
                                                 <div className="alpha-dir__grid">
                                                        {(grouped[letter] || []).map((item) => (
                                                               <button
                                                                      key={item.id}
                                                                      type="button"
                                                                      className="alpha-dir__item"
                                                                      onClick={() => onSelect?.(item)}
                                                               >
                                                                      {item.label}
                                                               </button>
                                                        ))}
                                                 </div>
                                          </section>
                                   ))}
                            </div>
                     )}

                     <style dangerouslySetInnerHTML={{
                            __html: `
                            .alpha-dir {
                                   background: #fff;
                                   border: 1px solid #ECEEF2;
                                   border-radius: 16px;
                                   padding: 24px 20px 12px;
                            }
                            .alpha-dir__letters {
                                   display: flex;
                                   flex-wrap: wrap;
                                   gap: 8px;
                                   justify-content: flex-start;
                            }
                            .alpha-dir__letter {
                                   min-width: 36px;
                                   height: 36px;
                                   padding: 0 8px;
                                   border: 1px solid #D0D5DD;
                                   background: #fff;
                                   color: #23262F;
                                   font-size: 13px;
                                   font-weight: 600;
                                   border-radius: 4px;
                                   line-height: 1;
                                   transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
                            }
                            .alpha-dir__letter:hover:not(:disabled) {
                                   border-color: #43ACE9;
                                   color: #43ACE9;
                            }
                            .alpha-dir__letter.is-active {
                                   border-color: #43ACE9;
                                   color: #43ACE9;
                                   box-shadow: inset 0 0 0 1px #43ACE9;
                            }
                            .alpha-dir__letter.is-disabled,
                            .alpha-dir__letter:disabled {
                                   opacity: 0.35;
                                   cursor: not-allowed;
                            }
                            .alpha-dir__rule {
                                   height: 1px;
                                   background: #43ACE9;
                                   margin: 18px 0 8px;
                            }
                            .alpha-dir__sections {
                                   display: flex;
                                   flex-direction: column;
                            }
                            .alpha-dir__section {
                                   display: grid;
                                   grid-template-columns: 56px 1fr;
                                   gap: 12px;
                                   padding: 22px 0;
                                   border-bottom: 1px solid #ECEEF2;
                                   align-items: center;
                            }
                            .alpha-dir__section:last-child {
                                   border-bottom: none;
                            }
                            .alpha-dir__section-letter {
                                   font-size: 42px;
                                   font-weight: 300;
                                   line-height: 1;
                                   color: #43ACE9;
                                   padding-top: 0;
                            }
                            .alpha-dir__grid {
                                   display: grid;
                                   grid-template-columns: repeat(4, minmax(0, 1fr));
                                   gap: 10px 24px;
                                   align-content: center;
                                   align-items: center;
                            }
                            .alpha-dir__item {
                                   text-align: left;
                                   background: transparent;
                                   border: none;
                                   padding: 4px 0;
                                   color: #23262F;
                                   font-size: 15px;
                                   font-weight: 500;
                                   line-height: 1.4;
                                   cursor: pointer;
                                   transition: color 0.15s ease;
                            }
                            .alpha-dir__item:hover {
                                   color: #43ACE9;
                                   text-decoration: underline;
                                   text-underline-offset: 3px;
                            }
                            .alpha-dir__empty {
                                   padding: 40px 12px;
                                   text-align: center;
                                   color: #777E91;
                                   font-size: 15px;
                                   font-weight: 500;
                            }
                            @media (max-width: 992px) {
                                   .alpha-dir__grid {
                                          grid-template-columns: repeat(3, minmax(0, 1fr));
                                   }
                            }
                            @media (max-width: 768px) {
                                   .alpha-dir__section {
                                          grid-template-columns: 40px 1fr;
                                   }
                                   .alpha-dir__section-letter {
                                          font-size: 32px;
                                   }
                                   .alpha-dir__grid {
                                          grid-template-columns: repeat(2, minmax(0, 1fr));
                                          gap: 8px 16px;
                                   }
                            }
                            @media (max-width: 480px) {
                                   .alpha-dir__letters {
                                          flex-wrap: nowrap;
                                          overflow-x: auto;
                                          scrollbar-width: none;
                                          padding-bottom: 4px;
                                   }
                                   .alpha-dir__letters::-webkit-scrollbar { display: none; }
                                   .alpha-dir__grid {
                                          grid-template-columns: 1fr;
                                   }
                            }
                     `}} />
              </div>
       );
}
