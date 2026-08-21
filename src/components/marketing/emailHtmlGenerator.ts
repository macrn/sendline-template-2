import { EmailTemplate, EmailPalette, EmailFontFamily, EmailSection } from '../../types';

export function generateEmailHtml(template: EmailTemplate): string {
  const isDark = template.paletteTheme === 'obsidian';
  
  // Font stacks
  const fontStacks = {
    'serif': "'Playfair Display', Georgia, Cambria, serif",
    'sans': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    'mono': "'JetBrains Mono', Consolas, Monaco, monospace",
    'display-slab': "'Cinzel', 'Playfair Display', Georgia, serif",
    'script-hand': "'Caveat', cursive, 'Brush Script MT', sans-serif"
  };

  const selectedFont = fontStacks[template.fontFamily as keyof typeof fontStacks] || fontStacks.sans;

  // Colors with custom overrides
  const paletteColors = {
    sunflower: { outer: '#FBF5DF', card: '#2B3324', text: '#FDFBF7', sub: '#D1DEC3', btnBg: '#E8D284', btnText: '#1F2E20' },
    lavender: { outer: '#EDE9FE', card: '#2A3042', text: '#FFFFFF', sub: '#C5CAE9', btnBg: '#FFFFFF', btnText: '#1E2330' },
    olive: { outer: '#E8EDE0', card: '#1E2C1E', text: '#FAF8F5', sub: '#C8D6C5', btnBg: '#C5D8B8', btnText: '#152215' },
    terracotta: { outer: '#F7EFE6', card: '#6B4C28', text: '#FFF8F0', sub: '#E8D5C4', btnBg: '#F5E6D3', btnText: '#4A3319' },
    sand: { outer: '#FAF8F5', card: '#FFFFFF', text: '#1C1917', sub: '#57534E', btnBg: '#1C1917', btnText: '#FFFFFF' },
    obsidian: { outer: '#0B0F17', card: '#131926', text: '#FFFFFF', sub: '#94A3B8', btnBg: '#6366F1', btnText: '#FFFFFF' }
  };

  const baseTheme = paletteColors[template.paletteTheme || 'sand'] || paletteColors.sand;
  const theme = {
    outer: template.customOuterBg || baseTheme.outer,
    card: template.customCardBg || baseTheme.card,
    text: template.customTextColor || baseTheme.text,
    sub: baseTheme.sub,
    btnBg: template.customBtnBg || baseTheme.btnBg,
    btnText: template.customBtnText || baseTheme.btnText
  };

  const renderSectionHtml = (section: EmailSection): string => {
    const secBg = section.bgColor || 'transparent';
    const secText = section.textColor || theme.text;
    const pTop = section.paddingTop !== undefined ? section.paddingTop : (section.paddingY ?? 24);
    const pBottom = section.paddingBottom !== undefined ? section.paddingBottom : (section.paddingY ?? 24);
    const pLeft = section.paddingLeft !== undefined ? section.paddingLeft : 36;
    const pRight = section.paddingRight !== undefined ? section.paddingRight : 36;
    const secPadding = `${pTop}px ${pRight}px ${pBottom}px ${pLeft}px`;

    switch (section.type) {
      case 'layout': {
        const isSplit = 
          section.layoutVariant === 'coaching-circle' ||
          section.layoutVariant === 'split-circle-right' ||
          section.layoutVariant === 'split-circle-left' ||
          section.layoutVariant === 'split-square-left' ||
          section.layoutVariant === 'split-square-right';

        if (isSplit) {
          const isLeftImage = 
            section.layoutVariant === 'split-square-left' || 
            section.layoutVariant === 'split-circle-left' || 
            section.imagePosition === 'split-left' || 
            section.imagePosition === 'left';
          const isCircle = 
            section.layoutVariant === 'coaching-circle' || 
            section.layoutVariant === 'split-circle-right' || 
            section.layoutVariant === 'split-circle-left' || 
            section.imageShape === 'circle';

          const imgRadius = isCircle ? '50%' : '16px';
          const imageHtml = section.imageUrl ? `
            <img src="${section.imageUrl}" width="220" style="display: block; width: 100%; max-width: 220px; aspect-ratio: 1/1; border-radius: ${imgRadius}; object-fit: cover; border: ${isCircle ? `2px solid ${theme.sub}` : 'none'}; margin: 0 auto;" alt="${section.title || ''}" />
          ` : `
            <div style="width: 100%; max-width: 200px; height: 180px; background-color: #EFECE6; border-radius: ${imgRadius}; border: 1px solid #E2DED6; display: flex; align-items: center; justify-content: center; margin: 0 auto; text-align: center; line-height: 180px; color: #8C827A; font-size: 24px;">📷</div>
          `;

          const textHtml = `
            <div style="padding: 10px 16px; text-align: left;">
              ${(section.originalPrice || section.discountPrice) ? `
              <div style="font-family: monospace; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                ${section.originalPrice ? `<span style="text-decoration: line-through; opacity: 0.5; margin-right: 8px; color: ${theme.sub};">${section.originalPrice}</span>` : ''}
                <span style="color: ${secText}; font-size: 16px; font-weight: 800;">${section.discountPrice || ''}</span>
              </div>` : ''}
              <h3 style="margin: 0 0 10px 0; color: ${secText}; font-family: ${selectedFont}; font-size: 20px; font-weight: 700; line-height: 1.25;">
                ${section.title || 'Featured Program'}
              </h3>
              ${section.body ? `<p style="margin: 0 0 12px 0; font-size: 13px; color: ${theme.sub}; line-height: 1.5;">${section.body}</p>` : ''}
              <a href="${section.ctaUrl || '#'}" style="color: ${secText}; font-weight: 700; font-size: 13px; text-decoration: underline; letter-spacing: 0.5px;">
                ${section.ctaText || 'Learn more'}
              </a>
            </div>
          `;

          return `
          <tr>
            <td style="padding: ${secPadding} 28px; background-color: ${secBg};">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" valign="middle" align="center">
                    ${isLeftImage ? imageHtml : textHtml}
                  </td>
                  <td width="50%" valign="middle" align="center">
                    ${isLeftImage ? textHtml : imageHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        if (section.layoutVariant === 'tips-numbered') {
          return `
          <tr>
            <td align="center" style="padding: ${secPadding} 36px; background-color: ${secBg !== 'transparent' ? secBg : 'rgba(255,255,255,0.04)'};">
              <div style="font-family: ${selectedFont}; font-size: 48px; color: ${theme.btnBg}; line-height: 1; margin-bottom: 4px;">
                ${section.numberPrefix || '6'}
              </div>
              <h2 style="margin: 0 0 12px 0; color: ${secText}; font-family: ${selectedFont}; font-size: 24px; font-weight: 700; line-height: 1.2;">
                ${section.title || 'Tips to Photograph Food'}
              </h2>
              <div style="width: 40px; height: 1px; background-color: ${theme.sub}; margin: 0 auto 14px auto;"></div>
              <p style="margin: 0 0 20px 0; color: ${theme.sub}; font-size: 14px; line-height: 1.6; max-width: 420px;">
                ${section.body || 'I remember my first try at food photography. I created this guide to help you get started without making all the mistakes I did.'}
              </p>
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: ${theme.btnBg}; border-radius: 6px;">
                    <a href="${section.ctaUrl || '#'}" style="display: inline-block; padding: 10px 24px; font-size: 11px; font-weight: 700; color: ${theme.btnText}; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                      ${section.ctaText || 'READ IT'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        if (section.layoutVariant === 'side-by-side') {
          return `
          <tr>
            <td style="padding: 20px 30px; background-color: ${secBg};">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 16px; overflow: hidden; background-color: rgba(255,255,255,0.05);">
                <tr>
                  <td width="50%" valign="middle">
                    <img src="${section.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}" width="100%" style="display: block; width: 100%; height: 180px; object-fit: cover;" alt="Feature" />
                  </td>
                  <td width="50%" valign="middle" align="center" style="padding: 20px 16px;">
                    <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 12px; color: ${theme.sub};">From The 'Gram</span>
                    <h4 style="margin: 6px 0 14px 0; font-family: ${selectedFont}; font-size: 15px; color: ${secText}; font-weight: 700; line-height: 1.3;">
                      ${section.title || 'The Post That Got Everyone Talking'}
                    </h4>
                    <a href="${section.ctaUrl || '#'}" style="display: inline-block; padding: 6px 16px; background-color: ${theme.btnBg}; color: ${theme.btnText}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 4px;">
                      ${section.ctaText || 'SEE IT'}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
        }

        if (section.layoutVariant === 'stacked-discount') {
          return `
          <tr>
            <td align="center" style="padding: 30px 20px; background-color: #000000; position: relative;">
              <div style="font-size: 44px; font-weight: 900; line-height: 0.95; color: rgba(255,255,255,0.25); letter-spacing: -2px; font-family: sans-serif; text-transform: uppercase;">
                30%<br/>30%<br/>30%
              </div>
              ${section.imageUrl ? `
              <div style="margin-top: -60px; padding: 0 40px;">
                <img src="${section.imageUrl}" width="220" style="display: inline-block; width: 220px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" alt="Product Discount" />
              </div>` : ''}
              <h3 style="margin: 16px 0 6px 0; color: #FFFFFF; font-family: ${selectedFont}; font-size: 20px; font-weight: 700;">
                ${section.title || 'EXCLUSIVE 30% VIP CODE'}
              </h3>
            </td>
          </tr>`;
        }

        // Generic layout fallback
        return `
        <tr>
          <td align="${section.textAlign || 'center'}" style="padding: ${secPadding}; background-color: ${secBg};">
            ${section.title ? `<h3 style="margin: 0 0 8px 0; color: ${secText}; font-family: ${selectedFont}; font-size: 22px;">${section.title}</h3>` : ''}
            ${section.body ? `<p style="margin: 0; color: ${theme.sub}; font-size: 14px; line-height: 1.6;">${section.body}</p>` : ''}
          </td>
        </tr>`;
      }

      case 'two-images': {
        const imgRad = `${section.imageRadius !== undefined ? section.imageRadius : 16}px`;
        return `
        <tr>
          <td style="padding: ${secPadding}; background-color: ${secBg};">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="48%" valign="top" align="center">
                  ${section.imageUrl ? `
                  <img src="${section.imageUrl}" width="260" alt="${section.imageAlt || 'Image 1'}" style="display: block; width: 100%; border-radius: ${imgRad}; aspect-ratio: 4/3; object-fit: cover;" />
                  ` : `
                  <div style="width: 100%; height: 160px; background-color: #EFECE6; border-radius: ${imgRad}; border: 1px dashed #D2CDC4; text-align: center; line-height: 160px; color: #8C827A; font-size: 11px; font-weight: 700; font-family: sans-serif;">IMAGE 1</div>
                  `}
                  ${(section.imageTitle1 || section.imageSubtitle1) ? `
                  <div style="padding-top: 8px; text-align: center;">
                    ${section.imageTitle1 ? `<div style="font-weight: 700; font-size: 13px; color: ${secText}; font-family: ${selectedFont};">${section.imageTitle1}</div>` : ''}
                    ${section.imageSubtitle1 ? `<div style="font-size: 11px; color: ${theme.sub}; margin-top: 2px;">${section.imageSubtitle1}</div>` : ''}
                  </div>` : ''}
                </td>
                <td width="4%" style="font-size: 0; line-height: 0;">&nbsp;</td>
                <td width="48%" valign="top" align="center">
                  ${section.imageUrl2 ? `
                  <img src="${section.imageUrl2}" width="260" alt="${section.imageAlt2 || 'Image 2'}" style="display: block; width: 100%; border-radius: ${imgRad}; aspect-ratio: 4/3; object-fit: cover;" />
                  ` : `
                  <div style="width: 100%; height: 160px; background-color: #EFECE6; border-radius: ${imgRad}; border: 1px dashed #D2CDC4; text-align: center; line-height: 160px; color: #8C827A; font-size: 11px; font-weight: 700; font-family: sans-serif;">IMAGE 2</div>
                  `}
                  ${(section.imageTitle2 || section.imageSubtitle2) ? `
                  <div style="padding-top: 8px; text-align: center;">
                    ${section.imageTitle2 ? `<div style="font-weight: 700; font-size: 13px; color: ${secText}; font-family: ${selectedFont};">${section.imageTitle2}</div>` : ''}
                    ${section.imageSubtitle2 ? `<div style="font-size: 11px; color: ${theme.sub}; margin-top: 2px;">${section.imageSubtitle2}</div>` : ''}
                  </div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      }

      case 'image': {
        const imgRad = `${section.imageRadius !== undefined ? section.imageRadius : 18}px`;
        return `
        <tr>
          <td align="center" style="padding: ${secPadding}; background-color: ${secBg};">
            <img src="${section.imageUrl || template.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'}" alt="${section.imageAlt || 'Hero Image'}" width="${section.imageWidth || 500}" style="display: block; width: 100%; max-width: ${section.imageWidth || 500}px; height: auto; border-radius: ${imgRad};" />
          </td>
        </tr>`;
      }

      case 'logo':
        const logoH = section.spacerHeight || 44;
        const logoW = section.imageWidth || 180;
        const logoPadY = section.paddingY !== undefined ? section.paddingY : 12;

        let logoContentHtml = '';
        if (section.logoUrl) {
          logoContentHtml = `<img src="${section.logoUrl}" alt="${section.logoSubtitle || 'Logo'}" style="height: ${logoH}px; max-height: ${logoH}px; width: ${logoW}px; max-width: 100%; object-fit: contain; display: inline-block;" border="0" />`;
        } else if (section.monogramText) {
          const monoSize = Math.min(logoW, logoH);
          logoContentHtml = `
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td align="center" style="width: ${monoSize}px; height: ${monoSize}px; min-width: ${monoSize}px; min-height: ${monoSize}px; border: 1.5px solid ${theme.sub}; border-radius: 50%; color: ${secText}; font-size: 12px; font-weight: 700; letter-spacing: 2px;">
                  ${section.monogramText}
                </td>
              </tr>
            </table>`;
        } else {
          logoContentHtml = `
            <div style="display: inline-block; width: ${logoW}px; max-width: 100%; height: ${logoH}px; border: 1.5px dashed ${theme.sub}; border-radius: 8px; line-height: ${logoH}px; text-align: center; color: ${theme.sub}; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              LOGO
            </div>`;
        }

        return `
        <tr>
          <td align="${section.textAlign || 'center'}" style="padding: ${logoPadY}px 30px ${Math.max(2, logoPadY - 4)}px 30px; background-color: ${secBg};">
            ${logoContentHtml}
            ${section.logoSubtitle ? `
            <div style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 14px; color: ${theme.sub}; margin-top: 4px;">
              ${section.logoSubtitle}
            </div>` : ''}
          </td>
        </tr>`;

      case 'text':
        return `
        <tr>
          <td align="${section.textAlign || 'center'}" style="padding: ${secPadding} 36px; background-color: ${secBg};">
            ${section.title ? `<h2 style="margin: 0 0 10px 0; color: ${secText}; font-family: ${selectedFont}; font-size: ${section.fontSize || 28}px; line-height: 1.2; font-weight: 700;">${section.title}</h2>` : ''}
            ${section.body ? `<p style="margin: 0; color: ${theme.sub}; font-size: 15px; line-height: 1.7;">${section.body.replace(/\n/g, '<br/><br/>')}</p>` : ''}
          </td>
        </tr>`;

      case 'button':
        return `
        <tr>
          <td align="center" style="padding: ${secPadding} 36px; background-color: ${secBg};">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background-color: ${section.buttonBg || theme.btnBg}; border-radius: 999px;">
                  <a href="${section.ctaUrl || template.ctaUrl || '#'}" target="_blank" style="display: inline-block; padding: 14px 36px; font-family: ${selectedFont}; font-size: 12px; font-weight: 700; color: ${section.buttonColor || theme.btnText}; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px;">
                    ${section.ctaText || template.ctaText || 'EXPLORE NOW'}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

      case 'divider':
        return `
        <tr>
          <td align="center" style="padding: 16px 40px;">
            <div style="width: 100%; height: 1px; border-top: 1px ${section.dividerStyle || 'solid'} ${theme.sub}; opacity: 0.3;"></div>
          </td>
        </tr>`;

      case 'form-field':
        return `
        <tr>
          <td align="center" style="padding: 20px 40px; background-color: ${secBg};">
            <table border="0" cellpadding="0" cellspacing="0" style="max-width: 440px; width: 100%; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 18px;">
              ${section.formFieldLabel ? `
              <tr>
                <td style="color: ${secText}; font-family: ${selectedFont}; font-size: 14px; font-weight: 700; padding-bottom: 10px;">
                  ${section.formFieldLabel} ${section.formFieldRequired ? '<span style="color: #F472B6;">*</span>' : ''}
                </td>
              </tr>` : ''}
              <tr>
                <td>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="background-color: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 10px 14px; color: ${theme.sub}; font-size: 13px;">
                        ${section.formFieldPlaceholder || 'Enter your email...'}
                      </td>
                      <td width="10">&nbsp;</td>
                      <td width="120" align="center" style="background-color: ${theme.btnBg}; border-radius: 10px; padding: 10px 14px;">
                        <a href="${section.ctaUrl || '#'}" style="color: ${theme.btnText}; text-decoration: none; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block;">
                          ${section.formSubmitButtonText || 'SUBMIT'}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

      case 'form-survey':
        return `
        <tr>
          <td align="center" style="padding: 24px 30px; background-color: ${secBg};">
            <table border="0" cellpadding="0" cellspacing="0" style="max-width: 440px; width: 100%; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 20px; text-align: center;">
              ${section.subtitle ? `
              <tr>
                <td style="color: #F472B6; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding-bottom: 6px;">
                  ${section.subtitle}
                </td>
              </tr>` : ''}
              <tr>
                <td style="color: ${secText}; font-family: ${selectedFont}; font-size: 16px; font-weight: 700; padding-bottom: 14px;">
                  ${section.title || 'How was your experience with us?'}
                </td>
              </tr>
              <tr>
                <td align="center">
                  <table border="0" cellpadding="0" cellspacing="6">
                    <tr>
                      <td style="background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; text-align: center; color: ${secText}; font-weight: 800; font-size: 13px;">1</td>
                      <td style="background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; text-align: center; color: ${secText}; font-weight: 800; font-size: 13px;">2</td>
                      <td style="background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; text-align: center; color: ${secText}; font-weight: 800; font-size: 13px;">3</td>
                      <td style="background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; text-align: center; color: ${secText}; font-weight: 800; font-size: 13px;">4</td>
                      <td style="background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; width: 36px; height: 36px; text-align: center; color: ${secText}; font-weight: 800; font-size: 13px;">5</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

      case 'spacer':
        return `
        <tr>
          <td height="${section.spacerHeight || 24}" style="font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>`;

      case 'countdown':
        return `
        <tr>
          <td align="center" style="padding: 20px 30px; background-color: rgba(255,255,255,0.06); border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 2px; color: ${theme.sub}; text-transform: uppercase;">
              ${section.countdownLabel || 'LIMITED TIME FLASH SALE ENDS IN'}
            </span>
            <table border="0" cellpadding="0" cellspacing="6" style="margin-top: 10px;">
              <tr>
                <td align="center" style="background-color: ${theme.outer}; padding: 8px 12px; border-radius: 8px;">
                  <div style="font-family: monospace; font-size: 18px; font-weight: 800; color: ${theme.text};">24</div>
                  <div style="font-size: 9px; color: ${theme.sub};">HOURS</div>
                </td>
                <td align="center" style="background-color: ${theme.outer}; padding: 8px 12px; border-radius: 8px;">
                  <div style="font-family: monospace; font-size: 18px; font-weight: 800; color: ${theme.text};">38</div>
                  <div style="font-size: 9px; color: ${theme.sub};">MINS</div>
                </td>
                <td align="center" style="background-color: ${theme.outer}; padding: 8px 12px; border-radius: 8px;">
                  <div style="font-family: monospace; font-size: 18px; font-weight: 800; color: ${theme.text};">15</div>
                  <div style="font-size: 9px; color: ${theme.sub};">SECS</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

      case 'linkbar':
        return `
        <tr>
          <td align="center" style="padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="font-family: monospace; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${theme.sub};">
              <a href="#" style="color: ${theme.text}; text-decoration: none; margin: 0 10px;">SHOP</a> •
              <a href="#" style="color: ${theme.text}; text-decoration: none; margin: 0 10px;">JOURNAL</a> •
              <a href="#" style="color: ${theme.text}; text-decoration: none; margin: 0 10px;">ABOUT</a> •
              <a href="#" style="color: ${theme.text}; text-decoration: none; margin: 0 10px;">ARCHIVE</a>
            </div>
          </td>
        </tr>`;

      case 'video':
        return `
        <tr>
          <td align="center" style="padding: 12px 30px 20px 30px;">
            <div style="position: relative; display: inline-block; width: 100%; max-width: 500px; border-radius: 16px; overflow: hidden;">
              <img src="${section.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80'}" width="500" style="display: block; width: 100%; border-radius: 16px;" alt="Video thumbnail" />
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 52px; height: 52px; background-color: rgba(0,0,0,0.7); border-radius: 50%; border: 2px solid #FFFFFF; text-align: center; line-height: 50px; color: #FFFFFF; font-size: 20px;">
                ▶
              </div>
            </div>
          </td>
        </tr>`;

      case 'social':
        return `
        <tr>
          <td align="center" style="padding: 20px 30px 10px 30px;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${theme.sub};">
              FOLLOW OUR JOURNAL & RETREATS
            </div>
            <div style="margin-top: 10px; font-size: 13px; color: ${theme.text};">
              <a href="#" style="color: ${theme.text}; margin: 0 8px; text-decoration: none;">Instagram</a> • 
              <a href="#" style="color: ${theme.text}; margin: 0 8px; text-decoration: none;">Pinterest</a> • 
              <a href="#" style="color: ${theme.text}; margin: 0 8px; text-decoration: none;">TikTok</a>
            </div>
          </td>
        </tr>`;

      case 'footer':
        return `
        <tr>
          <td align="center" style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.1); background-color: rgba(0,0,0,0.15);">
            <p style="margin: 0; color: ${theme.sub}; font-size: 11px; line-height: 1.6;">
              ${section.footerNote || 'Delivered with care via Sendline High-Deliverability Network.'}<br/>
              Want to manage your preferences? <a href="#" style="color: ${theme.text}; text-decoration: underline;">Unsubscribe</a> or <a href="#" style="color: ${theme.text}; text-decoration: underline;">Update Profile</a>.
            </p>
          </td>
        </tr>`;

      case 'ecommerce':
        return `
        <tr>
          <td align="center" style="padding: 20px 36px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255,255,255,0.06); border-radius: 18px; padding: 20px;">
              <tr>
                <td align="center">
                  <img src="${section.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'}" width="160" style="display: block; width: 160px; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 12px;" alt="Product" />
                  <h4 style="margin: 0 0 6px 0; font-family: ${selectedFont}; font-size: 18px; color: ${theme.text}; font-weight: 700;">
                    ${section.title || 'Pure Botanical Lip Elixir'}
                  </h4>
                  <div style="font-family: monospace; font-size: 16px; font-weight: 800; color: ${theme.btnBg}; margin-bottom: 14px;">
                    ${section.discountPrice || '$38.00'}
                  </div>
                  <a href="${section.ctaUrl || '#'}" style="display: inline-block; padding: 10px 24px; background-color: ${theme.btnBg}; color: ${theme.btnText}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 999px;">
                    ${section.ctaText || 'ADD TO BAG'}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

      default:
        return '';
    }
  };

  // If template has modular sections, render them:
  const hasCustomSections = template.sections && template.sections.length > 0;

  const sectionsContentHtml = hasCustomSections 
    ? template.sections!.map(renderSectionHtml).join('\n')
    : `
          <!-- Monogram / Insignia Header -->
          ${template.monogram ? `
          <tr>
            <td align="center" style="padding: 36px 30px 10px 30px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="width: 44px; height: 44px; border: 1.5px solid ${theme.sub}; border-radius: 50%; color: ${theme.text}; font-size: 13px; font-weight: 700; letter-spacing: 2px;">
                    ${template.monogram}
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Flash Sale / Ticker Tape Marquee Band -->
          ${template.tickerText ? `
          <tr>
            <td align="center" style="padding: 8px 16px; background-color: rgba(255,255,255,0.08); border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="font-size: 10px; font-weight: 800; font-family: monospace; letter-spacing: 3px; color: ${theme.text}; text-transform: uppercase;">
                ${template.tickerText}
              </span>
            </td>
          </tr>` : ''}

          <!-- Script Overlay / Sub-Header -->
          ${template.scriptOverlay ? `
          <tr>
            <td align="center" style="padding: 10px 30px 4px 30px;">
              <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 18px; color: ${theme.sub}; letter-spacing: 0.5px;">
                ${template.scriptOverlay}
              </span>
            </td>
          </tr>` : ''}

          <!-- Headline Title -->
          <tr>
            <td align="${template.textAlign || 'center'}" style="padding: 16px 36px 20px 36px;">
              <h1 style="margin: 0; color: ${theme.text}; font-family: ${selectedFont}; font-size: ${template.fontSize || 36}px; line-height: 1.15; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                ${template.headline}
              </h1>
            </td>
          </tr>

          <!-- Hero Image -->
          ${template.imageUrl ? `
          <tr>
            <td align="center" style="padding: 10px 30px 24px 30px;">
              <img src="${template.imageUrl}" alt="${template.headline}" width="500" style="display: block; width: 100%; max-width: 500px; height: auto; border-radius: 18px;" />
            </td>
          </tr>` : ''}

          <!-- Rating Stars & Testimonial Quote -->
          ${template.testimonialQuote ? `
          <tr>
            <td align="center" style="padding: 10px 36px 20px 36px;">
              <div style="color: #F59E0B; font-size: 18px; letter-spacing: 3px; margin-bottom: 12px;">★★★★★</div>
              <p style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-style: italic; color: ${theme.text}; font-size: 16px; line-height: 1.6; max-width: 440px;">
                ${template.testimonialQuote}
              </p>
              ${template.testimonialAuthor ? `
              <p style="margin: 8px 0 0 0; color: ${theme.sub}; font-size: 12px; font-weight: 600;">
                — ${template.testimonialAuthor}
              </p>` : ''}
            </td>
          </tr>` : ''}

          <!-- Story / Body Text -->
          <tr>
            <td align="${template.textAlign || 'center'}" style="padding: 12px 40px 28px 40px;">
              <p style="margin: 0; color: ${theme.sub}; font-size: 15px; line-height: 1.7;">
                ${template.body.replace(/\n/g, '<br/><br/>')}
              </p>
            </td>
          </tr>

          <!-- Coupon Voucher Box (If Present) -->
          ${template.couponCode ? `
          <tr>
            <td align="center" style="padding: 0 40px 24px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255,255,255,0.08); border: 1.5px dashed ${theme.sub}; border-radius: 16px; padding: 16px;">
                <tr>
                  <td align="center">
                    <span style="font-size: 11px; font-weight: 700; color: ${theme.sub}; text-transform: uppercase; letter-spacing: 1px;">VIP VOUCHER CODE</span>
                    <div style="font-size: 18px; font-weight: 800; color: ${theme.text}; font-family: monospace; letter-spacing: 2px; margin: 4px 0;">${template.couponCode}</div>
                    <span style="font-size: 12px; color: ${theme.sub};">${template.couponDiscount || 'Exclusive member discount'}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Call To Action Button -->
          <tr>
            <td align="center" style="padding: 10px 40px 40px 40px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: ${theme.btnBg}; border-radius: ${template.buttonShape === 'sharp' ? '4px' : '999px'};">
                    <a href="${template.ctaUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: ${selectedFont}; font-size: 12px; font-weight: 700; color: ${theme.btnText}; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px;">
                      ${template.ctaText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Legal & Unsubscribe -->
          <tr>
            <td align="center" style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.1); background-color: rgba(0,0,0,0.15);">
              <p style="margin: 0; color: ${theme.sub}; font-size: 11px; line-height: 1.6;">
                Delivered with care via Sendline High-Deliverability Network.<br/>
                Want to manage your preferences? <a href="#" style="color: ${theme.text}; text-decoration: underline;">Unsubscribe</a> or <a href="#" style="color: ${theme.text}; text-decoration: underline;">Update Profile</a>.
              </p>
            </td>
          </tr>
    `;

  const canvasRad = template.canvasRadius !== undefined 
    ? `${template.canvasRadius}px` 
    : (template.frameShape === 'square' ? '0px' : template.frameShape === 'pill' ? '44px' : template.frameShape === 'arch' ? '120px 120px 24px 24px' : '28px');
  const canvasW = `${template.canvasWidth || 600}px`;
  const canvasBorderAttr = template.canvasBorder 
    ? `border: ${template.canvasBorderWidth || 2}px solid ${template.canvasBorderColor || 'rgba(0,0,0,0.1)'};` 
    : '';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${template.subject}</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Cinzel:wght@600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: ${theme.outer}; font-family: ${selectedFont}; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${theme.outer};">
  
  <!-- Preheader Snippet -->
  <div style="display: none; font-size: 1px; color: ${theme.outer}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${template.preheader}
  </div>

  <!-- Outer Container -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${theme.outer}; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <!-- Main Email Card (Configurable Width & Radius) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${canvasW}; background-color: ${theme.card}; border-radius: ${canvasRad}; ${canvasBorderAttr} overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          ${sectionsContentHtml}
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
