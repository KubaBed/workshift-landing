"""
Workshift Brand Book — PDF Generator
Generates BRAND.pdf from brand identity, design tokens, and guidelines.
Run: python3 generate_brand_pdf.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Register Arial TTF (full Unicode — supports Polish) ───────────────────────
_FONT_DIR = '/System/Library/Fonts/Supplemental'
pdfmetrics.registerFont(TTFont('Arial',            f'{_FONT_DIR}/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold',       f'{_FONT_DIR}/Arial Bold.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic',     f'{_FONT_DIR}/Arial Italic.ttf'))
pdfmetrics.registerFont(TTFont('Arial-BoldItalic', f'{_FONT_DIR}/Arial Bold Italic.ttf'))
pdfmetrics.registerFontFamily(
    'Arial',
    normal='Arial',
    bold='Arial-Bold',
    italic='Arial-Italic',
    boldItalic='Arial-BoldItalic',
)

FONT        = 'Arial'
FONT_BOLD   = 'Arial-Bold'
FONT_ITALIC = 'Arial-Italic'

# ── Brand tokens ──────────────────────────────────────────────────────────────
SAGE        = HexColor('#E6E8DD')
LIME        = HexColor('#9CE069')
LIME_DARK   = HexColor('#7bc44a')
LIME_LIGHT  = HexColor('#b8ec92')
DARK        = HexColor('#000000')
MUTED_DARK  = HexColor('#595959')
MUTED_LIGHT = HexColor('#AAAAAA')
WHITE       = HexColor('#FFFFFF')
DESTRUCTIVE = HexColor('#DD453D')

W, H = A4   # 595 × 842 pt
MARGIN_H = 18 * mm
MARGIN_V = 20 * mm


# ── Custom Flowables ───────────────────────────────────────────────────────────

class ColorRect(Flowable):
    """Solid color rectangle — used for section backgrounds and dividers."""
    def __init__(self, width, height, color, radius=0):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color
        self.radius = radius

    def draw(self):
        self.canv.setFillColor(self.color)
        if self.radius:
            self.canv.roundRect(0, 0, self.width, self.height, self.radius, fill=1, stroke=0)
        else:
            self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)


class GradientDivider(Flowable):
    """Lime → sage gradient divider, 3pt high."""
    def __init__(self, width):
        super().__init__()
        self.width = width
        self.height = 3

    def draw(self):
        steps = 60
        for i in range(steps):
            t = i / steps
            r = int(0x9C + (0xE6 - 0x9C) * t)
            g = int(0xE0 + (0xE8 - 0xE0) * t)
            b = int(0x69 + (0xDD - 0x69) * t)
            self.canv.setFillColorRGB(r/255, g/255, b/255)
            self.canv.rect(self.width * i / steps, 0,
                           self.width / steps + 1, self.height, fill=1, stroke=0)


class ColorSwatch(Flowable):
    """Color swatch with hex label underneath."""
    def __init__(self, color, hex_str, name, size=24):
        super().__init__()
        self.color = color
        self.hex_str = hex_str
        self.name = name
        self.size = size
        self.width = size + 2
        self.height = size + 18

    def draw(self):
        c = self.canv
        c.setFillColor(self.color)
        c.setStrokeColor(HexColor('#CCCCCC'))
        c.roundRect(0, 18, self.size, self.size, 4, fill=1, stroke=1)
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT, 6)
        c.drawCentredString(self.size / 2, 7, self.hex_str)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 6.5)
        c.drawCentredString(self.size / 2, 0, self.name)


# ── Page template (background + header stripe) ────────────────────────────────

def on_page(canvas, doc):
    canvas.saveState()
    # Sage background
    canvas.setFillColor(SAGE)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Top lime stripe
    canvas.setFillColor(LIME)
    canvas.rect(0, H - 6, W, 6, fill=1, stroke=0)
    # Footer
    canvas.setFillColor(MUTED_LIGHT)
    canvas.setFont(FONT, 7)
    canvas.drawString(MARGIN_H, 12, 'Workshift — Brand Book & Design System  |  v1.0  |  kwiecień 2026')
    canvas.drawRightString(W - MARGIN_H, 12, f'Strona {doc.page}')
    canvas.restoreState()


def on_first_page(canvas, doc):
    canvas.saveState()
    # Full black cover
    canvas.setFillColor(DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Lime top bar
    canvas.setFillColor(LIME)
    canvas.rect(0, H - 8, W, 8, fill=1, stroke=0)
    # Lime bottom accent bar
    canvas.setFillColor(LIME)
    canvas.rect(0, 0, W, 3, fill=1, stroke=0)
    # Footer text
    canvas.setFillColor(MUTED_DARK)
    canvas.setFont(FONT, 7)
    canvas.drawString(MARGIN_H, 14, 'Workshift — Brand Book & Design System  |  v1.0  |  kwiecień 2026')
    canvas.restoreState()


# ── Styles ─────────────────────────────────────────────────────────────────────

def make_styles():
    base = dict(fontName=FONT, leading=14, textColor=DARK)

    cover_tag = ParagraphStyle('cover_tag', **{**base,
        'fontName': FONT, 'fontSize': 9, 'textColor': LIME,
        'leading': 12, 'spaceAfter': 8})

    cover_title = ParagraphStyle('cover_title', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 42, 'textColor': WHITE,
        'leading': 46, 'spaceAfter': 6})

    cover_sub = ParagraphStyle('cover_sub', **{**base,
        'fontName': FONT, 'fontSize': 14, 'textColor': MUTED_LIGHT,
        'leading': 20, 'spaceAfter': 32})

    section_label = ParagraphStyle('section_label', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 7, 'textColor': LIME_DARK,
        'leading': 10, 'spaceBefore': 22, 'spaceAfter': 4,
        'letterSpacing': 1.5})

    h1 = ParagraphStyle('h1', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 26, 'textColor': DARK,
        'leading': 30, 'spaceBefore': 4, 'spaceAfter': 12})

    h2 = ParagraphStyle('h2', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 16, 'textColor': DARK,
        'leading': 20, 'spaceBefore': 16, 'spaceAfter': 6})

    h3 = ParagraphStyle('h3', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 11, 'textColor': DARK,
        'leading': 14, 'spaceBefore': 10, 'spaceAfter': 4})

    body = ParagraphStyle('body', **{**base,
        'fontName': FONT, 'fontSize': 9, 'leading': 14,
        'spaceBefore': 2, 'spaceAfter': 4})

    body_muted = ParagraphStyle('body_muted', **{**base,
        'fontName': FONT, 'fontSize': 8.5, 'leading': 13,
        'textColor': MUTED_DARK, 'spaceBefore': 0, 'spaceAfter': 3})

    quote = ParagraphStyle('quote', **{**base,
        'fontName': FONT_ITALIC, 'fontSize': 12, 'textColor': DARK,
        'leading': 18, 'spaceBefore': 10, 'spaceAfter': 10,
        'leftIndent': 16, 'borderPadding': (8, 0, 8, 12)})

    bullet = ParagraphStyle('bullet', **{**base,
        'fontName': FONT, 'fontSize': 9, 'leading': 13,
        'leftIndent': 12, 'bulletIndent': 0, 'spaceBefore': 1, 'spaceAfter': 1})

    rule_title = ParagraphStyle('rule_title', **{**base,
        'fontName': FONT_BOLD, 'fontSize': 9, 'textColor': DARK,
        'leading': 13, 'spaceBefore': 6, 'spaceAfter': 1})

    caption = ParagraphStyle('caption', **{**base,
        'fontName': FONT, 'fontSize': 7.5, 'textColor': MUTED_DARK,
        'leading': 10})

    return dict(
        cover_tag=cover_tag, cover_title=cover_title, cover_sub=cover_sub,
        section_label=section_label, h1=h1, h2=h2, h3=h3,
        body=body, body_muted=body_muted, quote=quote, bullet=bullet,
        rule_title=rule_title, caption=caption
    )


S = make_styles()
CW = W - 2 * MARGIN_H   # content width


# ── Helper builders ────────────────────────────────────────────────────────────

def sp(n=6):
    return Spacer(1, n)


def divider():
    return GradientDivider(CW)


def section_header(label, title):
    return [
        sp(8),
        Paragraph(label.upper(), S['section_label']),
        Paragraph(title, S['h1']),
        divider(),
        sp(10),
    ]


def color_table(colors):
    """colors: list of (name, hex, usage)"""
    swatches_row = []
    for name, hex_val, _ in colors:
        color = HexColor(hex_val)
        swatches_row.append(ColorSwatch(color, hex_val, name, size=36))

    data = [swatches_row]
    col_w = CW / len(colors)
    t = Table(data, colWidths=[col_w] * len(colors))
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return t


def info_table(data, col_widths, header=True):
    """Generic styled table."""
    t = Table(data, colWidths=col_widths)
    styles = [
        ('FONTNAME', (0, 0), (-1, -1), FONT),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('LEADING', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (-1, -1), DARK),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [WHITE, SAGE]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.3, HexColor('#CCCCCC')),
    ]
    if header:
        styles += [
            ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 0), (-1, 0), DARK),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ]
    t.setStyle(TableStyle(styles))
    return t


def lime_badge(text, style=None):
    sty = style or ParagraphStyle('badge', fontName=FONT_BOLD,
                                   fontSize=8, textColor=DARK,
                                   backColor=LIME, borderPadding=4,
                                   leading=11)
    return Paragraph(text, sty)


def rule_block(number, title, body_text):
    return KeepTogether([
        sp(4),
        Table([[
            Paragraph(number, ParagraphStyle('rnum', fontName=FONT_BOLD,
                       fontSize=18, textColor=LIME, leading=20)),
            [Paragraph(title, S['rule_title']),
             Paragraph(body_text, S['body_muted'])]
        ]], colWidths=[28, CW - 28],
            style=TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ])),
        sp(4),
        HRFlowable(width=CW, thickness=0.3, color=HexColor('#DDDDDD')),
    ])


# ── Cover page ─────────────────────────────────────────────────────────────────

def cover():
    return [
        sp(60),
        Paragraph('WORKSHIFT', S['cover_tag']),
        Paragraph('Brand Book\n&amp; Design System', S['cover_title']),
        sp(8),
        Paragraph('Wersja 1.0 — Finalna  ·  Kwiecień 2026', S['cover_sub']),
        sp(40),
        Paragraph(
            'Wdrażamy AI, które po prostu działa.',
            ParagraphStyle('tagline', fontName=FONT_ITALIC,
                           fontSize=13, textColor=LIME, leading=18)
        ),
        PageBreak(),
    ]


# ── Section 1: Marka ───────────────────────────────────────────────────────────

def section_marka():
    items = []
    items += section_header('01 / Marka', 'Tożsamość marki')

    items.append(Paragraph(
        '„Wdrażamy pragmatyczne innowacje AI dla ambitnych Polskich MŚP."',
        S['quote']
    ))
    items.append(sp(8))
    items.append(Paragraph(
        'Workshift to boutique AI consulting dla polskich MŚP. Nie technologia na pokaz — '
        'konkretne wyniki bez rocznych transformacji. Filozofia: <b>przebudowa bez burzenia</b>.',
        S['body']
    ))

    items.append(Paragraph('Wartości marki', S['h2']))
    values_data = [
        ['#', 'Wartość', 'Co to znaczy'],
        ['1', 'Pragmatyzm', 'Żadnych buzzwordów. Tylko rozwiązania działające w poniedziałek rano.'],
        ['2', 'Mierzalne rezultaty', 'Zawsze konkretne liczby: +32% czasu, 45+ godzin miesięcznie.'],
        ['3', 'Prostota wdrożenia', 'Bez chaosu, bez przestojów, bez rocznych projektów.'],
        ['4', 'Transfer wiedzy', 'Zostawiamy wiedzę, nie zależność. Klient umie obsługiwać sam.'],
        ['5', 'Ludzkie podejście', 'Rozumiemy biznes najpierw — technologia jest narzędziem.'],
    ]
    items.append(info_table(values_data, [14, 70, CW - 84]))

    items.append(Paragraph('Grupa docelowa', S['h2']))
    items.append(Paragraph(
        'Właściciele i managerowie polskich MŚP — nie deweloperzy, nie specjaliści IT.',
        S['body']
    ))
    target_data = [
        ['Branża', 'Przykładowe zastosowania AI'],
        ['Kancelarie prawne', 'Automatyczne notatki, red-flagging umów, monitoring legislacji'],
        ['Agencje rekrutacyjne / HR', 'Screening CV, onboarding automation, boty obsługi'],
        ['E-Commerce', 'Obsługa klienta 24/7, opisy produktów, personalizacja'],
        ['Agencje marketingowe', 'Kreacje reklamowe AI, analiza kampanii, briefy'],
    ]
    items.append(info_table(target_data, [90, CW - 90]))

    items.append(Paragraph('Usługi (model à la carte)', S['h2']))
    services = [
        ('Automatyzacja procesów', 'Integracja narzędzi w jeden workflow, koniec ręcznego przepisywania'),
        ('Audyt i Strategia AI', 'Identyfikacja strat czasu — typowo ~32% do odzyskania'),
        ('Szkolenia AI', 'Prompt engineering, bezpieczeństwo AI, GenAI tools'),
        ('Agenci AI', 'Automatyczna pierwsza linia obsługi 24/7'),
        ('Kreacje reklamowe AI', 'Setki kreacji w dni zamiast miesięcy'),
    ]
    for name, desc in services:
        items.append(Paragraph(f'<b>{name}</b> — {desc}', S['bullet']))

    return items


# ── Section 2: Visual Identity ─────────────────────────────────────────────────

def section_visual():
    items = []
    items += section_header('02 / Visual Identity', 'Identyfikacja wizualna')

    # ── Colors ──
    items.append(Paragraph('Paleta kolorów', S['h2']))
    items.append(Paragraph(
        'System oparty na Workshift Design Tokens. Sage jako tło nadaje profesjonalny, '
        'spokojny charakter. Lime jako akcent wprowadza energię i kieruje uwagę.',
        S['body_muted']
    ))
    items.append(sp(8))

    core_colors = [
        ('Sage', '#E6E8DD', 'Główne tło'),
        ('Lime', '#9CE069', 'CTA, akcenty'),
        ('Dark', '#000000', 'Tekst, struktury'),
        ('Muted Dark', '#595959', 'Opisy drugorzędne'),
        ('Muted Light', '#AAAAAA', 'Captions, placeholder'),
        ('White', '#FFFFFF', 'Karty, modale'),
    ]
    items.append(color_table(core_colors))
    items.append(sp(8))

    variant_colors = [
        ('Accent Light', '#b8ec92', 'Hover, tła tagów'),
        ('Accent Rose', '#c5e0a8', 'Karty, ilustracje'),
        ('Accent Violet', '#d4e8c4', 'Karty, ilustracje'),
        ('Accent Purple', '#7bc44a', 'Aktywne stany'),
        ('Destructive', '#DD453D', 'Błędy, alerty'),
    ]
    items.append(Paragraph('Warianty i stany', S['h3']))
    items.append(color_table(variant_colors))
    items.append(sp(8))

    items.append(Paragraph('Zasady użycia kolorów', S['h3']))
    color_rules = [
        ['Sytuacja', 'Kolor', 'Hex'],
        ['Tło strony / sekcji', 'Sage', '#E6E8DD'],
        ['Główny przycisk CTA', 'Lime', '#9CE069'],
        ['Tekst nagłówka i treści', 'Dark', '#000000'],
        ['Tekst drugorzędny', 'Muted Dark', '#595959'],
        ['Etykiety, podpisy', 'Muted Light', '#AAAAAA'],
        ['Karta / modal', 'White', '#FFFFFF'],
        ['Selekcja tekstu', 'Lime bg / Black text', '#9CE069 / #000000'],
        ['Błąd / alert destruktywny', 'Destructive', '#DD453D'],
    ]
    items.append(info_table(color_rules, [100, 70, CW - 170]))

    items.append(Paragraph(
        'ZAKAZ: Nie używaj pomarańczu (#ee703d), granatowego (#0A2540) ani fontu Satoshi. '
        'To elementy legacy systemu.',
        ParagraphStyle('warning', fontName=FONT_BOLD, fontSize=8,
                       textColor=DESTRUCTIVE, leading=12, spaceBefore=6, spaceAfter=8)
    ))

    # ── Typography ──
    items.append(Paragraph('Typografia', S['h2']))
    items.append(Paragraph(
        'Jeden font (Inter) dla całego systemu + IBM Plex Mono wyłącznie do akcentów '
        'technicznych (liczby, metryki, etykiety). Spójność kroju = spokój i profesjonalizm.',
        S['body_muted']
    ))

    typo_data = [
        ['Rola', 'Font', 'Rozmiar', 'Weight', 'Tracking'],
        ['Hero H1', 'Inter', '72–96px', '400', '−3.6px'],
        ['Section H2', 'Inter', '36–48px', '400', 'tight'],
        ['Subsection H3', 'Inter', '24–30px', '400', 'tight'],
        ['H4–H6', 'Inter', '18–20px', '400', 'tight'],
        ['Body large', 'Inter', '18px', '400', 'normal'],
        ['Body default', 'Inter', '16px', '400', 'normal'],
        ['Body small', 'Inter', '14px', '400', 'normal'],
        ['Caption', 'Inter', '12px', '400', 'normal'],
        ['Label / Nav', 'Inter', '14px', '500', 'normal'],
        ['Mono accent', 'IBM Plex Mono', '14px', '400', 'normal'],
    ]
    items.append(info_table(typo_data, [90, 75, 55, 45, CW - 265]))

    # ── Spacing ──
    items.append(Paragraph('Spacing & Layout', S['h2']))
    radius_data = [
        ['Token', 'Wartość', 'Użycie'],
        ['--radius-sm', '4px', 'Tagi, badges, małe elementy'],
        ['--radius-md', '8px', 'Checkboxy, przyciski xs'],
        ['--radius-lg (default)', '10px', 'Przyciski, inputy, karty — standard'],
        ['--radius-xl', '16px', 'Duże karty, modale'],
        ['--radius-2xl', '20px', 'Prominentne sekcje'],
        ['--radius-3xl', '24px', 'Duże panele'],
        ['--radius-4xl', '80px', 'Pill shape, nawigacja'],
    ]
    items.append(info_table(radius_data, [90, 44, CW - 134]))
    items.append(sp(6))

    layout_data = [
        ['Parametr', 'Wartość'],
        ['Container max-width', '1320px'],
        ['Header max-width', '1400px'],
        ['Padding poziomy (desktop)', 'px-6 → 24px'],
        ['Padding poziomy (mobile)', 'px-4 → 16px'],
        ['Breakpoint md', '768px (tablet)'],
        ['Breakpoint lg', '1024px (laptop)'],
    ]
    items.append(info_table(layout_data, [140, CW - 140]))

    return items


# ── Section 3: Komponenty UI ───────────────────────────────────────────────────

def section_ui():
    items = []
    items += section_header('03 / Komponenty UI', 'Komponenty i animacje')

    items.append(Paragraph('Przyciski (Button)', S['h2']))
    items.append(Paragraph(
        'Komponent oparty na CVA (class-variance-authority) + BaseUI primitive. '
        'Jeden accent button na widok — nie stackuj kilku CTA obok siebie.',
        S['body_muted']
    ))

    btn_data = [
        ['Variant', 'Wygląd', 'Kiedy używać'],
        ['accent', 'Lime bg, czarny tekst, cień', 'Główne CTA — jeden na widoku'],
        ['accent-outline', 'Lime border, transparent bg', 'Drugorzędne CTA obok accent'],
        ['default', 'Lime bg (primary)', 'Przyciski w UI i formularzach'],
        ['outline', 'Border, hover muted bg', 'Akcje drugorzędne'],
        ['secondary', 'Białe bg', 'Na ciemnych tłach, akcje neutralne'],
        ['ghost', 'Bez tła, hover muted', 'Nawigacja, akcje dyskretne'],
        ['destructive', 'Czerwone tło 10%', 'Usuń / cofnij — niebezpieczne'],
        ['link', 'Tylko tekst + underline', 'Linki w treści'],
    ]
    items.append(info_table(btn_data, [70, 110, CW - 180]))

    items.append(Paragraph('Rozmiary przycisków', S['h3']))
    size_data = [
        ['Size', 'Wysokość', 'Użycie'],
        ['xs', '24px', 'Gęste UI, tabele, badges'],
        ['sm', '28px', 'Sidebar, kompaktowe panele'],
        ['default', '32px', 'Standard — większość przypadków'],
        ['lg', '36px', 'Hero CTA, prominentne akcje'],
        ['icon / icon-sm / icon-lg', '24–36px kwadrat', 'Przyciski z ikoną bez tekstu'],
    ]
    items.append(info_table(size_data, [90, 55, CW - 145]))

    items.append(Paragraph('Animacje', S['h2']))

    anim_data = [
        ['Animacja', 'Parametry', 'Użycie'],
        ['FadeUp', 'opacity 0→1, y +30px→0\n0.8s, cubic-bezier(0.21,0.47,0.32,0.98)\nIntersectionObserver, once',
         'Każda główna sekcja strony wchodzi przez FadeUp'],
        ['Floating', 'translateY + rotate loop\neaseInOutSine, 4–12s\namplituda ~12px, will-change: transform',
         'Tylko dekoracyjne elementy tła — nigdy na treści'],
        ['TextReveal', 'Word-by-word + blur effect',
         'Wyłącznie hero headline — oszczędnie'],
        ['Scale / Gradient', 'scaleX\ncubic-bezier(0.16, 1, 0.3, 1)',
         'Dividery, paski akcent'],
    ]
    items.append(info_table(anim_data, [70, 120, CW - 190]))
    items.append(Paragraph(
        'prefers-reduced-motion: wszystkie animacje skracane do 0.01ms.',
        S['caption']
    ))

    return items


# ── Section 4: Tone of Voice ───────────────────────────────────────────────────

def section_tov():
    items = []
    items += section_header('04 / Tone of Voice', 'Głos i komunikacja')

    items.append(Paragraph(
        'Workshift mówi do właścicieli firm i managerów, nie do deweloperów. '
        'Krótkie zdania. Konkretne liczby. Żadnych korporacyjnych eufemizmów.',
        S['body']
    ))
    items.append(sp(8))

    rules = [
        ('01', 'Konkret zamiast abstrakcji',
         'Zawsze konkretna liczba, czas, wynik. Nie „usprawniamy procesy" — '
         '„odzyskujesz 32% czasu tygodniowo".'),
        ('02', 'Bezpośredniość bez agresji',
         'Krótkie zdania. Mówimy jak do partnera w biznesie, nie jak do leadu w CRM.'),
        ('03', 'My też jesteśmy w tej grze',
         'Empatia przez wspólne doświadczenie: „Wiemy, o co toczy się gra, bo sami w nią gramy."'),
        ('04', 'Rezultat, nie technologia',
         'Klient nie kupuje „agenta AI" — kupuje „pierwszą linię obsługi działającą o 3 w nocy".'),
        ('05', 'Żadnych kompromisów w standardach',
         'Obiecujemy: konkretne rezultaty, transfer wiedzy, brak chaosu. I dotrzymujemy.'),
    ]
    for num, title, body_text in rules:
        items.append(rule_block(num, title, body_text))

    items.append(sp(10))
    items.append(Paragraph('Czego unikamy', S['h2']))

    avoid_data = [
        ['Unikaj', 'Zamiast tego'],
        ['„Rewolucjonizujemy..."', '„Wdrażamy w 4 tygodnie"'],
        ['„Innowacyjne rozwiązanie AI"', '„Automatyczne notatki ze spotkań"'],
        ['„Synergiczne podejście"', '(usuń, nic nie daje)'],
        ['„State-of-the-art modele"', '„GPT-4 + Twoje dane"'],
        ['„Transformacja cyfrowa"', '„Jeden workflow zamiast pięciu narzędzi"'],
        ['Pasywna strona zwrotna', 'Aktywna: „Ty oszczędzasz", nie „Czas jest oszczędzany"'],
    ]
    items.append(info_table(avoid_data, [CW / 2, CW / 2]))

    items.append(Paragraph('Nagłówki — dobre vs złe', S['h2']))
    examples_data = [
        ['✗ Źle', '✓ Dobrze'],
        ['„Innowacyjne AI dla Twojej firmy"', '„Wdrażamy AI, które po prostu działa"'],
        ['„Kompleksowe rozwiązania automatyzacji"', '„Koniec ręcznego przepisywania danych"'],
        ['„Transformujemy Twój biznes z AI"', '„32% czasu tygodniowo z powrotem w Twoich rękach"'],
        ['„Zaawansowane narzędzia dla profesjonalistów"', '„Kancelaria prawna: automatyczne notatki, mniej papierkologii"'],
        ['„Skontaktuj się z nami"', '„Zacznij od bezpłatnego audytu"'],
    ]
    t = Table(examples_data, colWidths=[CW / 2, CW / 2])
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), FONT),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('LEADING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.3, HexColor('#CCCCCC')),
        ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
        ('BACKGROUND', (0, 0), (-1, 0), DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SAGE]),
        ('TEXTCOLOR', (0, 1), (-1, -1), MUTED_DARK),
        ('TEXTCOLOR', (1, 1), (1, -1), DARK),
        ('FONTNAME', (1, 1), (1, -1), FONT_BOLD),
    ]))
    items.append(t)

    return items


# ── Section 5: Materiały marketingowe ─────────────────────────────────────────

def section_marketing():
    items = []
    items += section_header('05 / Marketing', 'Materiały marketingowe')

    items.append(Paragraph('Social Media (LinkedIn)', S['h2']))
    social_data = [
        ['Parametr', 'Wartość'],
        ['Tło grafik', 'Sage #E6E8DD lub Black #000000'],
        ['Kolor akcentu', 'Lime #9CE069 — jeden akcent na grafikę'],
        ['Font nagłówek', 'Inter Bold'],
        ['Font treść', 'Inter Regular'],
        ['Font metryki', 'IBM Plex Mono lub Inter Bold + Lime'],
        ['Ton', 'Jeden konkretny insight per post'],
        ['Struktura', 'Liczba/wynik w pierwszym zdaniu → kontekst → CTA'],
        ['Formaty', 'LinkedIn post: 1200×627px | Square: 1080×1080px'],
    ]
    items.append(info_table(social_data, [140, CW - 140]))

    items.append(Paragraph('Prezentacje (pitch deck, oferty)', S['h2']))
    pres_data = [
        ['Element', 'Wytyczna'],
        ['Tło slajdu', 'Sage #E6E8DD lub White'],
        ['Nagłówki slajdów', 'Inter Bold 36–48px'],
        ['Treść slajdów', 'Inter Regular 16–20px'],
        ['Metryki / liczby', 'IBM Plex Mono lub Inter Bold z Lime accent'],
        ['Jeden główny punkt', 'Na slajd — nie packuj więcej'],
        ['Duże liczby', 'Jako hero element każdego slajdu z danymi'],
        ['Zdjęcia', 'Jasne, minimalistyczne lub czarno-białe'],
    ]
    items.append(info_table(pres_data, [140, CW - 140]))

    items.append(Paragraph('Logo — zasady użycia', S['h2']))
    logo_data = [
        ['Parametr', 'Wartość'],
        ['Font', 'Inter Bold'],
        ['Tracking', '−0.04em'],
        ['Na jasnym tle', 'Czarny #000000'],
        ['Na ciemnym tle', 'Biały #FFFFFF'],
        ['Przestrzeń ochronna', 'Min. równa wysokości litery „W" ze wszystkich stron'],
    ]
    items.append(info_table(logo_data, [140, CW - 140]))

    items.append(sp(8))
    items.append(Paragraph(
        'ZAKAZ dla logo: nie rozciągaj proporcji | nie nakładaj na złożone tła bez kontrastu '
        '| nie używaj gradientu na logotypie.',
        ParagraphStyle('warning2', fontName=FONT_BOLD, fontSize=8,
                       textColor=DESTRUCTIVE, leading=12, spaceBefore=4, spaceAfter=8)
    ))

    items.append(Paragraph('Pliki techniczne', S['h2']))
    files_data = [
        ['Plik', 'Zawartość'],
        ['src/index.css', 'Source of truth — Tailwind CSS v4 @theme tokens'],
        ['design-system.css', 'CSS reference — dokumentacja aktualnego systemu Workshift'],
        ['BRAND.md', 'Kompletny brand book w Markdown (ten dokument)'],
        ['design-system-legacy.css', 'LEGACY — stary system (Satoshi + Orange). Nie używać.'],
    ]
    items.append(info_table(files_data, [130, CW - 130]))

    return items


# ── Assemble & build ───────────────────────────────────────────────────────────

OUTPUT = '/Users/kuba/Projekty/workshift-landing/BRAND.pdf'

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=MARGIN_H,
    rightMargin=MARGIN_H,
    topMargin=MARGIN_V + 6,
    bottomMargin=MARGIN_V,
    title='Workshift — Brand Book & Design System',
    author='Workshift / Jakub Bednarz',
    subject='Brand identity, design tokens, tone of voice',
)

story = (
    cover() +
    section_marka() +
    [PageBreak()] +
    section_visual() +
    [PageBreak()] +
    section_ui() +
    [PageBreak()] +
    section_tov() +
    [PageBreak()] +
    section_marketing()
)

doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
print(f'✓  PDF wygenerowany: {OUTPUT}')
