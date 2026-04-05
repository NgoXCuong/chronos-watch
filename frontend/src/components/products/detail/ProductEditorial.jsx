import React from 'react';
import { sanitizeQuillHtml } from '../../../utils/sanitizeQuill';

const ProductEditorial = ({ product, isDark }) => {
    return (
        <div className="mt-6 pt-6 border-t dark:border-white/5 border-zinc-100">
            {/* ── Section Header ── */}
            <div className="text-center mb-16">
                <p className="text-amber-500 text-[9px] uppercase font-bold mb-5">Chronos Chronicles</p>
                <h2
                    className={`text-4xl md:text-5xl font-light mb-6 leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    Hành Trình & Câu Chuyện
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-20 h-px bg-amber-500/30"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-amber-500/50"></div>
                    <div className="w-20 h-px bg-amber-500/30"></div>
                </div>
            </div>

            {/* ── Main editorial card ── */}
            <div className="max-w-4xl mx-auto">
                <div className={`editorial-card relative overflow-hidden ${isDark
                    ? 'bg-zinc-900/60 border border-white/[0.06]'
                    : 'bg-zinc-50/80 border border-zinc-200/80'
                    }`}>

                    {/* Ambient corner glow */}
                    <div className="editorial-ambient-tl" aria-hidden="true"></div>
                    <div className="editorial-ambient-br" aria-hidden="true"></div>

                    {/* Golden vertical rail */}
                    <div className="editorial-rail" aria-hidden="true"></div>

                    {/* ── Top meta bar ── */}
                    <div className={`relative z-10 flex items-center justify-between px-8 md:px-14 pt-10 pb-6 border-b ${isDark ? 'border-white/5' : 'border-zinc-200/60'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rotate-45 bg-amber-500"></div>
                            </div>
                            <span className={`text-[9px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                Biên tập viên · {product.brand?.name || 'Chronos'}
                            </span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-350'}`}>
                            Fine Timepieces
                        </span>
                    </div>

                    {/* ── Opening decorative quote ── */}
                    <div
                        className="editorial-opening-quote select-none pointer-events-none"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                        aria-hidden="true"
                    >
                        &#8220;
                    </div>

                    {/* ── Article body ── */}
                    <div className="relative z-10 px-8 md:px-14 pb-14 pt-4">
                        <article
                            className={`prose-editorial ${isDark ? 'text-zinc-300' : 'text-zinc-700'
                                }`}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeQuillHtml(
                                    product.description
                                    || `<p style="text-align:center;font-style:italic;color:#71717a;">Câu chuyện về tuyệt phẩm này đang được những nghệ nhân chúng tôi chuẩn bị kỹ lưỡng...</p>`
                                )
                            }}
                        />
                    </div>

                    {/* ── Bottom colophon bar ── */}
                    <div className={`relative z-10 flex items-center justify-between px-8 md:px-14 py-6 border-t ${isDark ? 'border-white/5' : 'border-zinc-200/60'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-px bg-amber-500/50"></div>
                            <span className={`text-[9px] uppercase font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-400'
                                }`}>
                                {product.brand?.name || 'Chronos'} · Fine Timepieces
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                            <div className="w-1.5 h-1.5 rotate-45 bg-amber-500/60"></div>
                            <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .editorial-card {
                    position: relative;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow:
                        0 0 0 1px rgba(217,119,6,0.08),
                        0 40px 80px -20px rgba(0,0,0,${isDark ? '0.5' : '0.1'}),
                        inset 0 1px 0 rgba(255,255,255,${isDark ? '0.04' : '0.7'});
                    transition: box-shadow 0.5s ease;
                }
                .editorial-card:hover {
                    box-shadow:
                        0 0 0 1px rgba(217,119,6,0.15),
                        0 60px 100px -20px rgba(0,0,0,${isDark ? '0.55' : '0.12'}),
                        inset 0 1px 0 rgba(255,255,255,${isDark ? '0.06' : '0.8'});
                }

                .editorial-ambient-tl {
                    position: absolute;
                    top: -60px;
                    left: -60px;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }
                .editorial-ambient-br {
                    position: absolute;
                    bottom: -60px;
                    right: -60px;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                .editorial-rail {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 3px;
                    height: 100%;
                    background: linear-gradient(
                        to bottom,
                        transparent 0%,
                        #d97706 20%,
                        rgba(217,119,6,0.4) 60%,
                        transparent 100%
                    );
                    pointer-events: none;
                    z-index: 5;
                }

                .editorial-opening-quote {
                    position: absolute;
                    top: 52px;
                    right: 32px;
                    font-size: 9rem;
                    line-height: 1;
                    color: rgba(217,119,6,${isDark ? '0.07' : '0.06'});
                    z-index: 1;
                    user-select: none;
                    pointer-events: none;
                }
                @media (min-width: 768px) {
                    .editorial-opening-quote {
                        font-size: 13rem;
                        right: 52px;
                    }
                }

                .prose-editorial {
                    font-family: 'Roboto', sans-serif !important;
                    font-size: 1rem;
                    line-height: 1.9;
                    letter-spacing: 0.01em;
                    overflow-wrap: break-word;
                    word-break: normal;
                    width: 100%;
                    position: relative;
                    z-index: 10;
                }

                .prose-editorial > p:first-of-type::first-letter {
                    float: left;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 4.5em;
                    line-height: 0.78;
                    margin-right: 0.12em;
                    margin-top: 0.08em;
                    color: #d97706;
                    font-weight: 700;
                }

                .prose-editorial span {
                    color: inherit !important;
                    background-color: transparent !important;
                    font-family: inherit !important;
                }

                .prose-editorial p {
                    margin-bottom: 1.75rem;
                    text-align: justify;
                }
                .prose-editorial p:last-child { margin-bottom: 0; }

                /* --- Text Alignment --- */
                .prose-editorial .ql-align-center,
                .prose-editorial [style*="text-align: center"] { text-align: center !important; }
                .prose-editorial .ql-align-right,
                .prose-editorial [style*="text-align: right"]   { text-align: right !important; }
                .prose-editorial .ql-align-justify,
                .prose-editorial [style*="text-align: justify"] { text-align: justify !important; }
                .prose-editorial .ql-align-left,
                .prose-editorial [style*="text-align: left"]     { text-align: left !important; }

                /* --- Headings --- */
                .prose-editorial h1,
                .prose-editorial h2,
                .prose-editorial h3,
                .prose-editorial h4,
                .prose-editorial h5,
                .prose-editorial h6 {
                    font-family: Georgia, 'Playfair Display', serif !important;
                    color: ${isDark ? '#f4f4f5' : '#18181b'} !important;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    line-height: 1.3;
                    margin-top: 3rem;
                    margin-bottom: 1.1rem;
                }
                .prose-editorial h1 strong, .prose-editorial h2 strong,
                .prose-editorial h3 strong, .prose-editorial h4 strong {
                    font-family: Georgia, 'Playfair Display', serif !important;
                    color: inherit !important;
                    font-weight: 700;
                }
                .prose-editorial h1 { font-size: 2.1rem; }
                .prose-editorial h2 {
                    font-size: 1.65rem;
                    padding-bottom: 0.6rem;
                    position: relative;
                }
                .prose-editorial h2::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 48px;
                    height: 2px;
                    background: linear-gradient(to right, #d97706, transparent);
                }
                .prose-editorial h3 { font-size: 1.3rem; }
                .prose-editorial h4 {
                    font-family: 'Roboto', sans-serif !important;
                    font-weight: 700;
                    font-size: 0.7rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #d97706 !important;
                    margin-top: 2.5rem;
                    padding-left: 1rem;
                    border-left: 2px solid #d97706;
                }
                .prose-editorial h5, .prose-editorial h6 { font-size: 0.95rem; font-weight: 600; }

                .prose-editorial strong, .prose-editorial b {
                    font-weight: 700;
                    color: ${isDark ? '#e4e4e7' : '#1c1917'};
                }
                .prose-editorial em, .prose-editorial i { font-style: italic; }
                .prose-editorial u { text-decoration: underline; text-underline-offset: 3px; }
                .prose-editorial s { text-decoration: line-through; opacity: 0.6; }

                .prose-editorial a {
                    color: #d97706;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(217,119,6,0.35);
                    transition: all 0.25s;
                }
                .prose-editorial a:hover {
                    color: #b45309;
                    border-bottom-color: #b45309;
                }

                .prose-editorial blockquote {
                    border: none;
                    margin: 3rem -0.5rem;
                    padding: 2rem 2.5rem;
                    background: ${isDark
                    ? 'linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(217,119,6,0.03) 100%)'
                    : 'linear-gradient(135deg, rgba(217,119,6,0.06) 0%, rgba(217,119,6,0.02) 100%)'
                };
                    position: relative;
                    font-style: italic;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.15rem;
                    line-height: 1.8;
                    color: ${isDark ? '#d4d4d8' : '#44403c'};
                    box-shadow: inset 3px 0 0 #d97706;
                }
                .prose-editorial blockquote p { margin-bottom: 0; text-align: left !important; }
                .prose-editorial blockquote::before {
                    content: '“';
                    position: absolute;
                    top: 8px;
                    left: 16px;
                    font-size: 3rem;
                    color: rgba(217,119,6,0.3);
                    font-family: 'Playfair Display', Georgia, serif;
                    line-height: 1;
                }

                .prose-editorial ul {
                    list-style-type: none;
                    padding-left: 0;
                    margin-bottom: 2rem;
                }
                .prose-editorial ul li {
                    position: relative;
                    padding-left: 1.75rem;
                    margin-bottom: 0.7rem;
                    line-height: 1.75;
                }
                .prose-editorial ul li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0.65em;
                    width: 6px;
                    height: 6px;
                    background: #d97706;
                    transform: rotate(45deg);
                }
                .prose-editorial ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 2rem;
                }
                .prose-editorial ol li {
                    margin-bottom: 0.7rem;
                    padding-left: 0.25rem;
                    line-height: 1.75;
                }
                .prose-editorial ol li::marker { color: #d97706; font-weight: 700; }

                .prose-editorial .ql-indent-1 { padding-left: 2.5rem; }
                .prose-editorial .ql-indent-2 { padding-left: 5rem; }
                .prose-editorial .ql-indent-3 { padding-left: 7.5rem; }

                .prose-editorial img {
                    display: block;
                    margin: 3.5rem auto;
                    width: 100%;
                    height: auto;
                    border-radius: 1px;
                    box-shadow:
                        0 0 0 1px rgba(217,119,6,0.15),
                        0 25px 70px -10px rgba(0,0,0,${isDark ? '0.55' : '0.18'});
                    transition: transform 0.6s ease, box-shadow 0.6s ease;
                }
                .prose-editorial img:hover {
                    transform: scale(1.01);
                    box-shadow:
                        0 0 0 1px rgba(217,119,6,0.25),
                        0 40px 90px -10px rgba(0,0,0,${isDark ? '0.65' : '0.22'});
                }

                .prose-editorial code {
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                    font-size: 0.85em;
                    background: ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'};
                    padding: 0.15em 0.45em;
                    border-radius: 3px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
                }
                .prose-editorial pre {
                    background: ${isDark ? '#18181b' : '#f4f4f5'};
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
                    padding: 1.5rem;
                    overflow-x: auto;
                    margin: 2rem 0;
                    border-radius: 2px;
                }
                .prose-editorial pre code {
                    background: none;
                    padding: 0;
                    border: none;
                    font-size: 0.875rem;
                }

                .prose-editorial table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 2.5rem 0;
                    font-size: 0.9rem;
                }
                .prose-editorial th {
                    text-align: left;
                    padding: 0.75rem 1rem;
                    background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'};
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 700;
                    color: #d97706;
                }
                .prose-editorial td {
                    padding: 0.75rem 1rem;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
                    vertical-align: top;
                }
                .prose-editorial tr:hover td {
                    background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
                }

                .prose-editorial .ql-size-small  { font-size: 0.8rem; }
                .prose-editorial .ql-size-large  { font-size: 1.3rem; }
                .prose-editorial .ql-size-huge   { font-size: 1.75rem; }

                .prose-editorial hr {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(217,119,6,0.4), transparent);
                    margin: 3.5rem 0;
                }
            `}</style>
        </div>
    );
};

export default ProductEditorial;
