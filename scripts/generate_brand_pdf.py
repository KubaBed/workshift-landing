"""
Workshift Brand Book — PDF Generator
Generates BRAND.pdf with screens, visualizations and design tokens.
Run: python3 scripts/generate_brand_pdf.py
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, Image as RLImage,
)
from reportlab.platypus import Flowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Fonts ─────────────────────────────────────────────────────────────────────
INTER_DIR = '/tmp/inter/extras/ttf'
PLEX_DIR  = '/tmp/plex/ibm-plex-mono/fonts/complete/ttf'

pdfmetrics.registerFont(TTFont('Inter',           f'{INTER_DIR}/Inter-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Inter-Medium',    f'{INTER_DIR}/Inter-Medium.ttf'))
pdfmetrics.registerFont(TTFont('Inter-Bold',      f'{INTER_DIR}/Inter-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Inter-Italic',    f'{INTER_DIR}/Inter-Italic.ttf'))
pdfmetrics.registerFont(TTFont('PlexMono',        f'{PLEX_DIR}/IBMPlexMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('PlexMono-Bold',   f'{PLEX_DIR}/IBMPlexMono-Bold.ttf'))
pdfmetrics.registerFontFamily(
    'Inter', normal='Inter', bold='Inter-Bold',
    italic='Inter-Italic', boldItalic='Inter-Bold',
)

FONT        = 'Inter'
FONT_MED    = 'Inter-Medium'
FONT_BOLD   = 'Inter-Bold'
FONT_ITALIC = 'Inter-Italic'
FONT_MONO   = 'PlexMono'
FONT_MONO_B = 'PlexMono-Bold'

# ── Brand tokens ──────────────────────────────────────────────────────────────
SAGE          = HexColor('#E6E8DD')
LIME          = HexColor('#9CE069')
LIME_DARK     = HexColor('#7bc44a')
LIME_LIGHT    = HexColor('#b8ec92')
ACCENT_ROSE   = HexColor('#c5e0a8')
ACCENT_VIOLET = HexColor('#d4e8c4')
DARK          = HexColor('#000000')
MUTED_DARK    = HexColor('#595959')
MUTED_LIGHT   = HexColor('#AAAAAA')
WHITE         = HexColor('#FFFFFF')
DESTRUCTIVE   = HexColor('#DD453D')

W, H = A4   # 595 × 842 pt
MARGIN_H = 18 * mm
MARGIN_V = 22 * mm
CW = W - 2 * MARGIN_H


# ─────────────────────────────────────────────────────────────────────────────
# CUSTOM FLOWABLES
# ─────────────────────────────────────────────────────────────────────────────

class GradientDivider(Flowable):
    def __init__(self, width, height=3):
        super().__init__()
        self.width, self.height = width, height

    def draw(self):
        steps = 80
        for i in range(steps):
            t = i / steps
            r = (0x9C + (0xE6 - 0x9C) * t) / 255
            g = (0xE0 + (0xE8 - 0xE0) * t) / 255
            b = (0x69 + (0xDD - 0x69) * t) / 255
            self.canv.setFillColorRGB(r, g, b)
            self.canv.rect(self.width * i / steps, 0,
                           self.width / steps + 1, self.height, fill=1, stroke=0)


class ColorSwatch(Flowable):
    """Square swatch with name, hex underneath. Aligns nicely in a table."""
    def __init__(self, color, hex_str, name, usage='', size=64):
        super().__init__()
        self.color, self.hex_str, self.name = color, hex_str, name
        self.usage = usage
        self.size = size
        self.width = size + 8
        self.height = size + 36

    def draw(self):
        c = self.canv
        c.setFillColor(self.color)
        c.setStrokeColor(HexColor('#DDDDDD'))
        c.setLineWidth(0.5)
        c.roundRect(0, 36, self.size, self.size, 6, fill=1, stroke=1)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 7.5)
        c.drawString(0, 23, self.name)
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT_MONO, 6.8)
        c.drawString(0, 14, self.hex_str)
        if self.usage:
            c.setFillColor(MUTED_DARK)
            c.setFont(FONT, 6.2)
            c.drawString(0, 4, self.usage)


class LogoWordmark(Flowable):
    """Renders 'Workshift' wordmark in Inter Bold + parallelogram icon."""
    def __init__(self, width, height=56, color=DARK, accent=LIME,
                 show_icon=True, font_size=42, ghost_color=None):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color
        self.accent = accent
        self.show_icon = show_icon
        self.font_size = font_size
        # background parallelograms color — defaults to muted of the wordmark color
        if ghost_color is None:
            if color == WHITE:
                ghost_color = Color(1, 1, 1, alpha=0.28)
            else:
                ghost_color = Color(0, 0, 0, alpha=0.20)
        self.ghost_color = ghost_color

    def draw(self):
        c = self.canv
        x_text = 0
        if self.show_icon:
            ax, ay = 0, 8
            scale = self.height / 70
            def quad(pts, col):
                c.setFillColor(col)
                p = c.beginPath()
                p.moveTo(ax + pts[0]*scale, ay + pts[1]*scale)
                for i in range(2, 8, 2):
                    p.lineTo(ax + pts[i]*scale, ay + pts[i+1]*scale)
                p.close()
                c.drawPath(p, fill=1, stroke=0)
            quad([8, 50, 50, 50, 44, 38, 2, 38], self.ghost_color)
            quad([13, 33, 55, 33, 49, 21, 7, 21],  self.accent)
            quad([8,  16, 50, 16, 44,  4,  2,  4], self.ghost_color)
            x_text = 60 * scale + 8

        c.setFillColor(self.color)
        c.setFont(FONT_BOLD, self.font_size)
        c.drawString(x_text, (self.height - self.font_size) / 2 + 4, 'Workshift')


class ButtonMock(Flowable):
    """Visualizes a button variant."""
    def __init__(self, label, variant='accent', width=110, height=36):
        super().__init__()
        self.label = label
        self.variant = variant
        self.width, self.height = width, height

    def draw(self):
        c = self.canv
        bg, fg, border = WHITE, DARK, None
        if self.variant == 'accent':
            bg, fg = LIME, DARK
        elif self.variant == 'accent-outline':
            bg, fg, border = None, DARK, LIME
        elif self.variant == 'outline':
            bg, fg, border = None, DARK, DARK
        elif self.variant == 'secondary':
            bg, fg = WHITE, DARK
        elif self.variant == 'ghost':
            bg, fg = None, DARK
        elif self.variant == 'destructive':
            bg, fg = HexColor('#fbe1df'), DESTRUCTIVE
        elif self.variant == 'link':
            bg, fg = None, DARK
        elif self.variant == 'default':
            bg, fg = LIME, DARK

        if bg is not None:
            c.setFillColor(bg)
            c.setStrokeColor(border or bg)
            c.setLineWidth(1.2 if border else 0)
            c.roundRect(0, 0, self.width, self.height, 8,
                        fill=1, stroke=1 if border else 0)
        elif border:
            c.setStrokeColor(border)
            c.setLineWidth(1.2)
            c.roundRect(0, 0, self.width, self.height, 8, fill=0, stroke=1)

        c.setFillColor(fg)
        c.setFont(FONT_MED, 11)
        text_w = c.stringWidth(self.label, FONT_MED, 11)
        c.drawString((self.width - text_w) / 2, (self.height - 11) / 2 + 2, self.label)

        if self.variant == 'link':
            c.setStrokeColor(fg)
            c.setLineWidth(0.6)
            tx = (self.width - text_w) / 2
            ty = (self.height - 11) / 2
            c.line(tx, ty, tx + text_w, ty)


class CardMock(Flowable):
    """White card mock with rounded radius, title, body text, optional CTA."""
    def __init__(self, width, height, title, body, cta=None, mono_label=None):
        super().__init__()
        self.width, self.height = width, height
        self.title, self.body, self.cta = title, body, cta
        self.mono_label = mono_label

    def draw(self):
        c = self.canv
        c.setFillColor(WHITE)
        c.setStrokeColor(HexColor('#E0E0DA'))
        c.setLineWidth(0.6)
        c.roundRect(0, 0, self.width, self.height, 16, fill=1, stroke=1)

        pad = 14
        y = self.height - pad - 10
        if self.mono_label:
            c.setFillColor(MUTED_DARK)
            c.setFont(FONT_MONO, 7)
            c.drawString(pad, y, self.mono_label.upper())
            y -= 12
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 13)
        c.drawString(pad, y, self.title)
        y -= 18
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT, 9)
        # wrap body manually
        words = self.body.split()
        line, lines = '', []
        max_w = self.width - 2 * pad
        for w in words:
            test = (line + ' ' + w).strip()
            if c.stringWidth(test, FONT, 9) > max_w:
                lines.append(line); line = w
            else:
                line = test
        if line: lines.append(line)
        for ln in lines[:6]:
            c.drawString(pad, y, ln)
            y -= 12
        if self.cta:
            cta_w = c.stringWidth(self.cta, FONT_MED, 10) + 24
            cy = 14
            c.setFillColor(LIME); c.setStrokeColor(LIME)
            c.roundRect(pad, cy, cta_w, 22, 6, fill=1, stroke=0)
            c.setFillColor(DARK); c.setFont(FONT_MED, 10)
            c.drawString(pad + 12, cy + 7, self.cta)


class GlassPanel(Flowable):
    """Mock of .glass-panel utility — frosted look approximated."""
    def __init__(self, width, height, dark=False):
        super().__init__()
        self.width, self.height, self.dark = width, height, dark

    def draw(self):
        c = self.canv
        if self.dark:
            c.setFillColor(Color(0, 0, 0, alpha=0.85))
            c.setStrokeColor(Color(1, 1, 1, alpha=0.2))
            fg = WHITE
            label = '.glass-panel-dark'
        else:
            c.setFillColor(Color(230/255, 232/255, 221/255, alpha=0.85))
            c.setStrokeColor(Color(0, 0, 0, alpha=0.2))
            fg = DARK
            label = '.glass-panel'
        c.setLineWidth(0.8)
        c.roundRect(0, 0, self.width, self.height, 12, fill=1, stroke=1)
        c.setFillColor(fg)
        c.setFont(FONT_MONO_B, 9)
        c.drawString(14, self.height / 2 - 4, label)


class HeroMock(Flowable):
    """A miniature mock of the landing hero — for marketing/visual section."""
    def __init__(self, width=CW, height=260):
        super().__init__()
        self.width, self.height = width, height

    def draw(self):
        c = self.canv
        c.setFillColor(SAGE)
        c.roundRect(0, 0, self.width, self.height, 14, fill=1, stroke=0)

        # Top nav
        c.setFillColor(Color(0, 0, 0, alpha=0.04))
        c.roundRect(14, self.height - 38, self.width - 28, 28, 14, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 10)
        c.drawString(28, self.height - 28, 'Workshift')
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT, 8)
        x = self.width - 28
        for label in ['Kontakt', 'Blog', 'Case studies', 'Usługi']:
            c.drawRightString(x, self.height - 28, label)
            x -= 64

        # Mono kicker
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT_MONO, 7)
        c.drawString(28, self.height - 70, '01 / WDROŻENIA AI DLA POLSKICH MŚP')

        # Headline
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 26)
        c.drawString(28, self.height - 106, 'Wdrażamy AI,')
        c.drawString(28, self.height - 134, 'które po prostu')
        # highlighted "działa"
        c.setFillColor(LIME)
        c.roundRect(28, self.height - 168, 100, 28, 4, fill=1, stroke=0)
        c.setFillColor(DARK)
        c.setFont(FONT_BOLD, 26)
        c.drawString(36, self.height - 162, 'działa.')

        # Body
        c.setFillColor(MUTED_DARK)
        c.setFont(FONT, 9)
        c.drawString(28, self.height - 196,
                     'Konkretne wyniki w 4 tygodnie — bez chaosu, bez rocznych transformacji.')

        # CTA + secondary (bottom)
        c.setFillColor(LIME); c.setStrokeColor(LIME)
        c.roundRect(28, 22, 130, 30, 6, fill=1, stroke=0)
        c.setFillColor(DARK); c.setFont(FONT_BOLD, 10)
        c.drawString(40, 31, 'Bezpłatny audyt')
        c.setStrokeColor(DARK); c.setLineWidth(1)
        c.roundRect(170, 22, 110, 30, 6, fill=0, stroke=1)
        c.setFillColor(DARK); c.setFont(FONT_MED, 10)
        c.drawString(184, 31, 'Zobacz usługi')


class SectionCover(Flowable):
    """Black section opener with big numeric label + title."""
    def __init__(self, num, label, title, height=120):
        super().__init__()
        self.num, self.label, self.title = num, label, title
        self.width = CW
        self.height = height

    def draw(self):
        c = self.canv
        c.setFillColor(DARK)
        c.roundRect(0, 0, self.width, self.height, 16, fill=1, stroke=0)
        # lime accent stripe
        c.setFillColor(LIME)
        c.rect(0, 0, 8, self.height, fill=1, stroke=0)
        # number
        c.setFillColor(LIME)
        c.setFont(FONT_MONO_B, 11)
        c.drawString(28, self.height - 30, self.num)
        # label
        c.setFillColor(MUTED_LIGHT)
        c.setFont(FONT_MONO, 8)
        c.drawString(28, self.height - 46, self.label.upper())
        # title
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 28)
        c.drawString(28, 28, self.title)


# ─────────────────────────────────────────────────────────────────────────────
# PAGE TEMPLATE
# ─────────────────────────────────────────────────────────────────────────────

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(SAGE)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # top lime stripe
    canvas.setFillColor(LIME)
    canvas.rect(0, H - 6, W, 6, fill=1, stroke=0)
    # footer
    canvas.setFillColor(MUTED_DARK)
    canvas.setFont(FONT, 7)
    canvas.drawString(MARGIN_H, 14, 'Workshift — Brand Book & Design System  ·  v1.1  ·  maj 2026')
    canvas.drawRightString(W - MARGIN_H, 14, f'{doc.page:02d}')
    canvas.restoreState()


def on_first_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # lime stripe top
    canvas.setFillColor(LIME)
    canvas.rect(0, H - 10, W, 10, fill=1, stroke=0)
    # lime stripe bottom
    canvas.setFillColor(LIME)
    canvas.rect(0, 0, W, 4, fill=1, stroke=0)
    # logo
    canvas.translate(MARGIN_H, H - 110)
    # parallelogram icon
    scale = 1.4
    def quad(pts, col):
        canvas.setFillColor(col)
        p = canvas.beginPath()
        p.moveTo(pts[0]*scale, pts[1]*scale)
        for i in range(2, 8, 2):
            p.lineTo(pts[i]*scale, pts[i+1]*scale)
        p.close()
        canvas.drawPath(p, fill=1, stroke=0)
    quad([8, 50, 50, 50, 44, 38, 2, 38], Color(1, 1, 1, alpha=0.25))
    quad([13, 33, 55, 33, 49, 21, 7, 21],  LIME)
    quad([8,  16, 50, 16, 44,  4,  2,  4], Color(1, 1, 1, alpha=0.25))
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT_BOLD, 28)
    canvas.drawString(85, 10, 'Workshift')
    canvas.restoreState()

    canvas.saveState()
    # Section label
    canvas.setFillColor(LIME)
    canvas.setFont(FONT_MONO_B, 9)
    canvas.drawString(MARGIN_H, H - 280, '— BRAND BOOK & DESIGN SYSTEM')
    # Big title
    canvas.setFillColor(WHITE)
    canvas.setFont(FONT_BOLD, 60)
    canvas.drawString(MARGIN_H, H - 380, 'Tożsamość')
    canvas.drawString(MARGIN_H, H - 444, 'marki.')
    # subtitle
    canvas.setFillColor(MUTED_LIGHT)
    canvas.setFont(FONT, 13)
    canvas.drawString(MARGIN_H, H - 484, 'Wytyczne, design tokens i ton komunikacji marki Workshift.')

    # tagline near bottom
    canvas.setFillColor(LIME)
    canvas.setFont(FONT_ITALIC, 14)
    canvas.drawString(MARGIN_H, 130, '„Wdrażamy AI, które po prostu działa."')
    canvas.setFillColor(MUTED_LIGHT)
    canvas.setFont(FONT, 9)
    canvas.drawString(MARGIN_H, 105, 'Jakub Bednarz · Workshift · Poznań')

    # version
    canvas.setFillColor(MUTED_DARK)
    canvas.setFont(FONT_MONO, 8)
    canvas.drawRightString(W - MARGIN_H, 30, 'v1.1 · maj 2026 · finalne')
    canvas.restoreState()


# ─────────────────────────────────────────────────────────────────────────────
# STYLES
# ─────────────────────────────────────────────────────────────────────────────

def style(name, **kw):
    base = dict(fontName=FONT, fontSize=9, leading=13, textColor=DARK)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    'section_label': style('section_label', fontName=FONT_MONO_B, fontSize=8,
                           textColor=LIME_DARK, leading=11, spaceBefore=10,
                           spaceAfter=2),
    'h1': style('h1', fontName=FONT_BOLD, fontSize=28, leading=32,
                spaceBefore=2, spaceAfter=14),
    'h2': style('h2', fontName=FONT_BOLD, fontSize=15, leading=20,
                spaceBefore=14, spaceAfter=6),
    'h3': style('h3', fontName=FONT_BOLD, fontSize=11, leading=14,
                spaceBefore=10, spaceAfter=4),
    'body': style('body', fontSize=9.2, leading=14, spaceBefore=2, spaceAfter=4),
    'body_muted': style('body_muted', fontSize=8.5, leading=13,
                        textColor=MUTED_DARK, spaceBefore=0, spaceAfter=3),
    'quote': style('quote', fontName=FONT_ITALIC, fontSize=14, leading=20,
                   spaceBefore=10, spaceAfter=12, leftIndent=14),
    'caption': style('caption', fontSize=7.5, leading=10, textColor=MUTED_DARK),
    'mono': style('mono', fontName=FONT_MONO, fontSize=8, leading=12,
                  textColor=MUTED_DARK),
}


def sp(n=6): return Spacer(1, n)
def divider(): return GradientDivider(CW)


def section_opener(num, label, title):
    return [sp(2), SectionCover(num, label, title), sp(18)]


def info_table(data, col_widths, header=True, body_color=DARK):
    # Wrap any plain string cell whose width may overflow into a Paragraph so
    # reportlab can word-wrap it. Header row stays as strings.
    body_style = ParagraphStyle('cell', fontName=FONT, fontSize=8.5, leading=12,
                                textColor=body_color, spaceBefore=0, spaceAfter=0)
    wrapped = []
    for row_i, row in enumerate(data):
        new_row = []
        for col_i, cell in enumerate(row):
            if isinstance(cell, str) and (header is False or row_i > 0):
                new_row.append(Paragraph(cell.replace('\n', '<br/>'), body_style))
            else:
                new_row.append(cell)
        wrapped.append(new_row)
    t = Table(wrapped, colWidths=col_widths)
    styles = [
        ('FONTNAME', (0, 0), (-1, -1), FONT),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('LEADING', (0, 0), (-1, -1), 12),
        ('TEXTCOLOR', (0, 0), (-1, -1), body_color),
        ('ROWBACKGROUNDS', (0, 1 if header else 0), (-1, -1), [WHITE, HexColor('#F2F4EB')]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('GRID', (0, 0), (-1, -1), 0.3, HexColor('#D6D9CC')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]
    if header:
        styles += [
            ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
            ('FONTSIZE', (0, 0), (-1, 0), 8.5),
            ('BACKGROUND', (0, 0), (-1, 0), DARK),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ]
    t.setStyle(TableStyle(styles))
    return t


# ─────────────────────────────────────────────────────────────────────────────
# SECTIONS
# ─────────────────────────────────────────────────────────────────────────────

def section_marka():
    items = section_opener('01', 'Tożsamość', 'Marka')

    items += [
        Paragraph('Misja', S['section_label']),
        Paragraph(
            '„Wdrażamy pragmatyczne innowacje AI dla ambitnych polskich MŚP."',
            S['quote']),
        Paragraph(
            'Workshift to <b>boutique AI consulting</b> dla polskich MŚP. '
            'Nie technologia na pokaz — konkretne wyniki bez rocznych transformacji. '
            'Filozofia: <b>przebudowa bez burzenia</b>.',
            S['body']),
        sp(4),
    ]

    items.append(Paragraph('Podstawowe fakty', S['h2']))
    facts = [
        ['Założyciel', 'Jakub Bednarz'],
        ['Kontakt', 'kontakt@workshift.pl  ·  Poznań'],
        ['Tagline', 'Wdrażamy AI, które po prostu działa'],
        ['Filozofia', 'Przebudowa bez burzenia — precyzyjne zmiany, nie rewolucja'],
        ['Język marki', 'Polski (klient) / Angielski (kod, dokumentacja techniczna)'],
    ]
    items.append(info_table(facts, [110, CW - 110], header=False))

    items.append(Paragraph('Wartości marki', S['h2']))
    values = [
        ['#', 'Wartość', 'Co to znaczy w praktyce'],
        ['01', 'Pragmatyzm', 'Żadnych buzzwordów. Rozwiązania działające w poniedziałek rano.'],
        ['02', 'Mierzalne rezultaty', 'Zawsze konkretne liczby: +32% czasu, 45+ godzin/miesiąc.'],
        ['03', 'Prostota wdrożenia', 'Bez chaosu, bez przestojów, bez rocznych projektów.'],
        ['04', 'Transfer wiedzy', 'Zostawiamy wiedzę, nie zależność. Klient umie obsługiwać sam.'],
        ['05', 'Ludzkie podejście', 'Rozumiemy biznes najpierw — technologia jest narzędziem.'],
    ]
    items.append(info_table(values, [22, 95, CW - 117]))

    items.append(Paragraph('Grupa docelowa', S['h2']))
    items.append(Paragraph(
        '<b>Właściciele i managerowie polskich MŚP</b> — nie deweloperzy, nie specjaliści IT. '
        'Szukają oszczędności czasu i mniejszych kosztów operacyjnych, '
        'bez technologicznego ryzyka.',
        S['body']))
    sectors = [
        ['Branża', 'Przykładowe zastosowania AI'],
        ['Kancelarie prawne i consulting', 'Automatyczne notatki, red-flagging umów, monitoring legislacji'],
        ['Agencje rekrutacyjne / HR',     'Screening CV, onboarding automation, boty pierwszej linii'],
        ['E-Commerce',                     'Obsługa klienta 24/7, opisy produktów, personalizacja oferty'],
        ['Agencje marketingowe / reklamowe', 'Setki kreacji w dni, analiza kampanii, briefy w godziny'],
    ]
    items.append(info_table(sectors, [180, CW - 180]))

    items.append(Paragraph('Usługi  ·  model à la carte', S['h2']))
    services = [
        ('Automatyzacja procesów',  'Integracja narzędzi w jeden workflow — koniec ręcznego przepisywania danych'),
        ('Audyt i Strategia AI',    'Identyfikacja strat czasu — typowo ~32% do odzyskania'),
        ('Szkolenia AI',            'Prompt engineering, bezpieczeństwo AI, GenAI tools'),
        ('Agenci AI',               'Automatyczna pierwsza linia obsługi 24/7'),
        ('Kreacje reklamowe AI',    'Setki kreacji w dni zamiast miesięcy'),
    ]
    cells = []
    for name, desc in services:
        cells.append([
            Paragraph(f'<b>{name}</b>', S['body']),
            Paragraph(desc, S['body_muted']),
        ])
    items.append(info_table([['Usługa', 'Krótki opis']] + cells,
                            [160, CW - 160]))
    return items


def section_logo():
    items = section_opener('02', 'Logo & Wordmark', 'Logo')

    items.append(Paragraph(
        'Logotyp Workshift składa się z <b>parallelogramowego znaku</b> '
        '(trzy poziome elementy ułożone w skosie) oraz wordmarku „Workshift" w kroju '
        'Inter Bold z trackingiem −0.04em. Środkowy parallelogram zawsze w kolorze Lime — '
        'to klucz rozpoznawczy marki.',
        S['body']))

    items.append(sp(10))
    # Light logo on sage
    items.append(Paragraph('Logo na jasnym tle (Sage)', S['h3']))
    items.append(LogoWordmark(CW, height=70, color=DARK, font_size=42))
    items.append(sp(8))

    # Dark version on black
    items.append(Paragraph('Logo na ciemnym tle (Black)', S['h3']))
    dark_panel = Table([[LogoWordmark(CW - 28, height=70, color=WHITE, font_size=42)]],
                       colWidths=[CW])
    dark_panel.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DARK),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 18),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 18),
    ]))
    items.append(dark_panel)

    items.append(sp(12))
    items.append(Paragraph('Specyfikacja techniczna', S['h2']))
    items.append(info_table([
        ['Parametr', 'Wartość'],
        ['Font wordmark',      'Inter Bold (700)'],
        ['Tracking',           '−0.04em'],
        ['Kolor na jasnym tle', 'Dark #000000 / akcent Lime #9CE069 w ikonie'],
        ['Kolor na ciemnym tle', 'White #FFFFFF / akcent Lime #9CE069 w ikonie'],
        ['Przestrzeń ochronna', 'Min. równa wysokości litery „W" ze wszystkich stron'],
        ['Min. wysokość ekran', '24px (icon-only) / 32px (z wordmarkiem)'],
        ['Min. wysokość druk',  '8mm (icon-only) / 12mm (z wordmarkiem)'],
    ], [140, CW - 140]))

    items.append(Paragraph('Zakaz dla logo', S['h2']))
    bans = [
        'Nie rozciągaj proporcji ani nie obracaj logo',
        'Nie zmieniaj koloru wordmarku ani środkowego parallelogramu (Lime)',
        'Nie stosuj gradientu, cieni, obrysów lub innych efektów na logotypie',
        'Nie nakładaj na skomplikowane tła bez kontrastowej powierzchni pod logo',
        'Nie używaj pełnokolorowej wersji na tłach Lime — kontrast ginie',
    ]
    for b in bans:
        items.append(Paragraph(f'<font color="#DD453D"><b>✗</b></font>  {b}', S['body']))
    return items


def section_colors():
    items = section_opener('03', 'Visual Identity', 'Kolory')

    items.append(Paragraph(
        'System oparty na <b>Workshift Design Tokens</b> (Tailwind v4 @theme). '
        'Sage jako tło nadaje profesjonalny, spokojny charakter. Lime jako akcent '
        'wprowadza energię i kieruje uwagę. Inne kolory są ograniczone do absolutnego minimum.',
        S['body']))

    items.append(Paragraph('Kolory główne', S['h2']))
    cores = [
        (SAGE, '#E6E8DD', 'Sage', 'Tło strony'),
        (LIME, '#9CE069', 'Lime', 'CTA, akcent'),
        (DARK, '#000000', 'Dark', 'Tekst, struktury'),
        (MUTED_DARK, '#595959', 'Muted Dark', 'Tekst 2°'),
        (MUTED_LIGHT, '#AAAAAA', 'Muted Light', 'Captions'),
        (WHITE, '#FFFFFF', 'White', 'Karty, modale'),
    ]
    swatches = [ColorSwatch(c, h, n, u, size=64) for c, h, n, u in cores]
    items.append(Table([swatches], colWidths=[CW / len(swatches)] * len(swatches),
                       style=TableStyle([
                           ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                           ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0),
                           ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                       ])))

    items.append(Paragraph('Warianty Lime i stany systemowe', S['h2']))
    variants = [
        (LIME_LIGHT, '#b8ec92', 'Accent Light', 'Hover, tła tagów'),
        (ACCENT_ROSE, '#c5e0a8', 'Accent Rose', 'Karty, ilustracje'),
        (ACCENT_VIOLET, '#d4e8c4', 'Accent Violet', 'Karty, ilustracje'),
        (LIME_DARK, '#7bc44a', 'Accent Purple', 'Aktywne stany'),
        (DESTRUCTIVE, '#DD453D', 'Destructive', 'Błędy, alerty'),
    ]
    swatches = [ColorSwatch(c, h, n, u, size=64) for c, h, n, u in variants]
    items.append(Table([swatches], colWidths=[CW / len(swatches)] * len(swatches),
                       style=TableStyle([
                           ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                           ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('LEFTPADDING', (0, 0), (-1, -1), 0),
                           ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                       ])))

    items.append(Paragraph('Kiedy używać czego', S['h2']))
    rules = [
        ['Sytuacja', 'Token', 'Hex'],
        ['Tło strony / sekcji', 'color-sage', '#E6E8DD'],
        ['Główny przycisk CTA', 'color-lime / primary', '#9CE069'],
        ['Tekst nagłówka i treści', 'color-dark / foreground', '#000000'],
        ['Tekst drugorzędny / opisy', 'color-muted-dark', '#595959'],
        ['Etykiety, podpisy, placeholder', 'color-muted-light', '#AAAAAA'],
        ['Karta / modal / panel na sage', 'white / secondary', '#FFFFFF'],
        ['Selekcja tekstu (::selection)', 'lime bg + dark text', '#9CE069 / #000000'],
        ['Focus ring', 'lime z opacity 50%', 'rgba(156,224,105,.5)'],
        ['Błąd / alert destruktywny', 'destructive', '#DD453D'],
    ]
    items.append(info_table(rules, [200, 130, CW - 330]))

    items.append(Paragraph('Zakazy', S['h2']))
    items.append(Paragraph(
        '<font color="#DD453D"><b>✗</b></font>  Nie używaj pomarańczu (#ee703d), '
        'granatowego (#0A2540), ani fontu Satoshi. To elementy legacy systemu — usunięte w v1.0.',
        S['body']))
    items.append(Paragraph(
        '<font color="#DD453D"><b>✗</b></font>  Nie używaj więcej niż jednego akcentu Lime '
        'na jednym widoku / grafice. Lime ma sygnalizować akcję — wiele Lime to wizualny szum.',
        S['body']))

    items.append(Paragraph('Kontrast & dostępność', S['h2']))
    items.append(info_table([
        ['Para', 'Wynik WCAG'],
        ['Dark #000000 na Sage #E6E8DD',          'AAA ✓ (12.6:1)'],
        ['Dark #000000 na Lime #9CE069',          'AA ✓  (8.9:1)'],
        ['Muted Dark #595959 na Sage #E6E8DD',    'AA ✓  (4.8:1)'],
        ['Muted Light #AAAAAA na Sage',           'tylko dekoracyjnie — nie treść'],
        ['Lime #9CE069 na Dark #000000',          'AA ✓  (8.9:1)'],
    ], [240, CW - 240]))

    return items


def section_typography():
    items = section_opener('04', 'Visual Identity', 'Typografia')

    items.append(Paragraph(
        '<b>Jeden font</b> — Inter — dla wszystkich poziomów hierarchii. '
        '<b>IBM Plex Mono</b> wyłącznie dla akcentów technicznych: numery sekcji, metryki, '
        'etykiety techniczne. Spójność = spokój i profesjonalizm.',
        S['body']))

    # Display samples
    items.append(sp(10))
    items.append(Paragraph('Próbki krojów', S['h2']))

    sample_rows = [
        ('Hero H1', 'Inter Bold', 30, 'AI, które działa.'),
        ('Section H2', 'Inter Bold', 22, 'Pragmatyczna automatyzacja.'),
        ('Subsection H3', 'Inter Bold', 16, 'Zacznij od bezpłatnego audytu'),
        ('Body large', 'Inter Regular', 13,
         'Konkretne rezultaty bez rocznych transformacji.'),
        ('Body default', 'Inter Regular', 11,
         'Workshift wdraża AI dla polskich MŚP — mierzalnie, bez chaosu.'),
        ('Caption / Label', 'Inter Medium', 9, 'Etykieta nawigacji'),
        ('Mono accent', 'IBM Plex Mono', 9, '+32% ODZYSKANEGO CZASU'),
    ]

    class TypeSample(Flowable):
        def __init__(self, role, font_name, size, text, width=CW):
            super().__init__()
            self.role, self.font_name, self.size, self.text = role, font_name, size, text
            self.width = width
            self.height = size + 26

        def draw(self):
            c = self.canv
            # Label column
            c.setFillColor(MUTED_DARK)
            c.setFont(FONT_MONO, 7)
            c.drawString(0, self.height - 10, self.role.upper())
            c.setFillColor(MUTED_LIGHT)
            c.setFont(FONT, 7.5)
            c.drawString(0, self.height - 20, f'{self.font_name} · {self.size}pt')
            # Sample
            font = FONT
            if self.font_name == 'Inter Bold':
                font = FONT_BOLD
            elif self.font_name == 'Inter Medium':
                font = FONT_MED
            elif self.font_name == 'IBM Plex Mono':
                font = FONT_MONO
            c.setFillColor(DARK)
            c.setFont(font, self.size)
            c.drawString(140, 4, self.text)
            # divider
            c.setStrokeColor(HexColor('#E0E0DA'))
            c.setLineWidth(0.4)
            c.line(0, 0, self.width, 0)

    for r in sample_rows:
        items.append(TypeSample(*r))
        items.append(sp(6))

    items.append(Paragraph('Skala typograficzna', S['h2']))
    typo = [
        ['Rola', 'Font', 'Rozmiar', 'Weight', 'Tracking'],
        ['Hero H1',        'Inter',          '72–96px', '400', '−3.6 do −4px'],
        ['Section H2',     'Inter',          '36–48px', '400', 'tracking-tight'],
        ['Subsection H3',  'Inter',          '24–30px', '400', 'tracking-tight'],
        ['H4–H6',          'Inter',          '18–20px', '400', 'tracking-tight'],
        ['Body large',     'Inter',          '18px',    '400', 'normal'],
        ['Body default',   'Inter',          '16px',    '400', 'normal'],
        ['Body small',     'Inter',          '14px',    '400', 'normal'],
        ['Caption',        'Inter',          '12px',    '400', 'normal'],
        ['Label / Nav',    'Inter',          '14px',    '500', 'normal'],
        ['Mono accent',    'IBM Plex Mono',  '14px',    '400', 'normal'],
        ['Logo wordmark',  'Inter',          '20px+',   '700', '−0.04em'],
    ]
    items.append(info_table(typo, [90, 90, 65, 50, CW - 295]))

    items.append(Paragraph('Zasady', S['h2']))
    rules = [
        'Wszystkie nagłówki globalnie: <b>font-weight 400</b>, <b>tracking-tight</b>, kolor <b>#000000</b> '
        '(Inter Regular jest wystarczająco mocny — nie używaj font-bold dla nagłówków treści).',
        'Logo wordmark: jedyny element z <b>font-weight 700</b> (bold) + <b>tracking-[-0.04em]</b>.',
        'Selekcja tekstu (::selection): <b>bg: #9CE069</b>, <b>color: #000000</b>.',
        'Globalne ustawienia: <b>antialiased</b>, <b>font-optical-sizing: auto</b>.',
        'IBM Plex Mono <b>nigdy</b> w treści ciągłej — tylko liczby, metryki, etykiety techniczne.',
    ]
    for r in rules:
        items.append(Paragraph(f'•  {r}', S['body']))
    return items


def section_layout_effects():
    items = section_opener('05', 'Visual Identity', 'Spacing & Efekty')

    items.append(Paragraph('Border radius', S['h2']))
    items.append(info_table([
        ['Token', 'Wartość', 'Użycie'],
        ['--radius-sm',  '4px',  'Tagi, badges, małe elementy'],
        ['--radius-md',  '8px',  'Checkboxy, przyciski xs'],
        ['--radius-lg',  '10px', 'Przyciski, inputy, karty (standard)'],
        ['--radius-xl',  '16px', 'Duże karty, modale'],
        ['--radius-2xl', '20px', 'Prominentne sekcje'],
        ['--radius-3xl', '24px', 'Duże panele'],
        ['--radius-4xl', '80px', 'Pill shape, nawigacja'],
    ], [90, 60, CW - 150]))

    items.append(Paragraph('Layout', S['h2']))
    items.append(info_table([
        ['Parametr', 'Wartość'],
        ['Container max-width',   '1320px'],
        ['Header max-width',      '1400px'],
        ['Padding poziomy desktop', 'px-6  →  24px'],
        ['Padding poziomy mobile (max-md)', 'px-4  →  16px'],
        ['Breakpoint sm', '640px'],
        ['Breakpoint md', '768px (tablet)'],
        ['Breakpoint lg', '1024px (laptop)'],
        ['Breakpoint xl', '1280px (duży monitor)'],
    ], [180, CW - 180]))

    items.append(Paragraph('Glass morphism', S['h2']))
    items.append(Paragraph(
        'Półprzezroczyste panele z efektem rozmycia tła. Używaj dla nawigacji, '
        'pływających kart, overlayów — nadają głębi bez ciężkości cieni.',
        S['body_muted']))
    glass_row = Table([[
        GlassPanel(CW / 2 - 8, 60, dark=False),
        GlassPanel(CW / 2 - 8, 60, dark=True),
    ]], colWidths=[CW / 2, CW / 2])
    glass_row.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    items.append(glass_row)

    items.append(Paragraph('Gradient divider', S['h2']))
    items.append(Paragraph(
        'Separator między głównymi sekcjami strony. Wysokość 3px, rounded-full, '
        'opacity 0.8. Komponent: <font name="PlexMono">&lt;GradientDivider /&gt;</font>.',
        S['body_muted']))
    items.append(sp(4))
    items.append(GradientDivider(CW, height=4))
    items.append(sp(8))
    items.append(Paragraph(
        '<font name="PlexMono">linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)</font>',
        S['caption']))

    items.append(Paragraph('Animacje', S['h2']))
    items.append(info_table([
        ['Animacja',    'Parametry', 'Użycie'],
        ['FadeUp',
         'opacity 0→1, y +30px→0\n0.8s, cubic-bezier(0.21,0.47,0.32,0.98)\nIntersectionObserver once',
         'Każda główna sekcja strony wchodzi przez FadeUp'],
        ['Floating',
         'translateY + rotate loop\neaseInOutSine, 4–12s\namplituda ~12px',
         'Dekoracyjne elementy tła — nigdy na treści/elementach interaktywnych'],
        ['TextReveal',
         'Word-by-word + blur effect',
         'Wyłącznie hero headline — oszczędnie, max 1 na stronę'],
        ['Scale / Gradient',
         'scaleX\ncubic-bezier(0.16, 1, 0.3, 1)',
         'Dividery, paski akcent'],
    ], [80, 145, CW - 225]))
    items.append(Paragraph(
        'Globalna reguła: <b>prefers-reduced-motion</b> skraca wszystkie animacje do 0.01ms. '
        '<b>Lenis</b> dla smooth scroll — nie nadpisuj scroll-behavior.',
        S['caption']))

    return items


def section_ui():
    items = section_opener('06', 'Komponenty', 'UI Components')

    items.append(Paragraph(
        'Komponenty oparte na <b>CVA (class-variance-authority)</b> + <b>BaseUI primitives</b>. '
        'Patrz <font name="PlexMono">src/components/ui/</font>. Jedna zasada nadrzędna: '
        '<b>jeden accent CTA na widoku</b>.',
        S['body']))

    items.append(Paragraph('Przyciski — warianty', S['h2']))

    btns = [
        ('Bezpłatny audyt',  'accent',         130),
        ('Zobacz usługi',    'accent-outline', 120),
        ('Wyślij',           'default',        82),
        ('Anuluj',           'outline',        80),
        ('Pokaż więcej',     'secondary',      105),
        ('Zamknij',          'ghost',          80),
        ('Usuń',             'destructive',    70),
        ('Czytaj więcej',    'link',           110),
    ]
    descs = [
        ('accent',         'Główne CTA na widoku — najmocniejszy akcent.'),
        ('accent-outline', 'Drugorzędne CTA obok accent.'),
        ('default',        'Standardowy primary w formularzach i UI.'),
        ('outline',        'Akcje drugorzędne, neutralne.'),
        ('secondary',      'Na ciemnych tłach, akcje neutralne.'),
        ('ghost',          'Nawigacja, akcje dyskretne.'),
        ('destructive',    'Usuń, cofnij — niebezpieczne akcje.'),
        ('link',           'Linki tekstowe w treści.'),
    ]
    rows = []
    for (label, variant, width), (_, desc) in zip(btns, descs):
        rows.append([
            ButtonMock(label, variant, width=width, height=32),
            Paragraph(f'<font name="PlexMono"><b>{variant}</b></font>', S['body']),
            Paragraph(desc, S['body_muted']),
        ])
    t = Table(rows, colWidths=[150, 110, CW - 260])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, 0), (-1, -2), 0.3, HexColor('#DDDDDD')),
    ]))
    items.append(t)

    items.append(Paragraph('Rozmiary przycisków', S['h2']))
    items.append(info_table([
        ['Size', 'Wysokość', 'Użycie'],
        ['xs', '24px', 'Gęste UI, tabele, badges'],
        ['sm', '28px', 'Sidebar, kompaktowe panele'],
        ['default', '32px', 'Standard — większość przypadków'],
        ['lg', '36px', 'Hero CTA, prominentne akcje'],
        ['icon / icon-sm / icon-lg', '24–36px kwadrat', 'Przyciski z ikoną bez tekstu'],
    ], [180, 90, CW - 270]))

    items.append(Paragraph('Karty', S['h2']))
    cards_row = Table([[
        CardMock(CW / 3 - 8, 130, 'Automatyzacja procesów',
                 'Integracja narzędzi w jeden workflow. Koniec ręcznego przepisywania danych.',
                 cta='Zobacz', mono_label='01 / usługa'),
        CardMock(CW / 3 - 8, 130, 'Audyt AI',
                 'Identyfikacja strat czasu. Typowo ~32% do odzyskania w pierwszym miesiącu.',
                 cta='Umów', mono_label='02 / usługa'),
        CardMock(CW / 3 - 8, 130, 'Szkolenia',
                 'Prompt engineering, bezpieczeństwo AI, narzędzia GenAI dla zespołu.',
                 cta='Szczegóły', mono_label='03 / usługa'),
    ]], colWidths=[CW / 3, CW / 3, CW / 3])
    cards_row.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    items.append(cards_row)

    items.append(Paragraph('Formularze', S['h2']))
    items.append(info_table([
        ['Element', 'Wysokość', 'Padding', 'Border', 'Focus'],
        ['Input',    '32px (h-8)',  'px-2.5 py-1', 'rgba(0,0,0,0.2), radius 10px', 'lime ring opacity 50%'],
        ['Textarea', 'min 64px',    'px-2.5 py-1', 'rgba(0,0,0,0.2), radius 10px', 'lime ring opacity 50%'],
        ['Select',   '32px (h-8)',  'px-2.5',      'rgba(0,0,0,0.2), radius 10px', 'lime ring opacity 50%'],
        ['Checkbox', '16×16',       '-',           'rgba(0,0,0,0.2), radius 4px',  'lime bg gdy zaznaczone'],
    ], [60, 75, 75, 165, CW - 375]))

    items.append(Paragraph('Accessibility', S['h2']))
    a11y = [
        'Focus ring: 3px <font name="PlexMono">#9CE069</font> z opacity 50% — widoczny zawsze.',
        '<font name="PlexMono">aria-invalid</font>: czerwony border + ring (Destructive).',
        '<font name="PlexMono">disabled</font>: pointer-events none, opacity 50%.',
        'Wszystkie interaktywne elementy: min. 32px wysokość (touch target).',
    ]
    for a in a11y:
        items.append(Paragraph(f'•  {a}', S['body']))

    return items


def section_tov():
    items = section_opener('07', 'Komunikacja', 'Tone of Voice')

    items.append(Paragraph(
        'Workshift mówi do <b>właścicieli firm i managerów</b>, nie do deweloperów. '
        'Krótkie zdania. Konkretne liczby. Żadnych korporacyjnych eufemizmów. '
        'Pierwsza osoba liczby mnogiej („wdrażamy", „wiemy") — partnerstwo, nie pouczanie.',
        S['body']))

    items.append(Paragraph('5 zasad pisania', S['h2']))
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

    class Rule(Flowable):
        def __init__(self, num, title, body):
            super().__init__()
            self.num, self.title, self.body = num, title, body
            self.width = CW; self.height = 56

        def draw(self):
            c = self.canv
            c.setFillColor(LIME)
            c.setFont(FONT_BOLD, 22)
            c.drawString(0, self.height - 24, self.num)
            c.setFillColor(DARK); c.setFont(FONT_BOLD, 11)
            c.drawString(46, self.height - 18, self.title)
            c.setFillColor(MUTED_DARK); c.setFont(FONT, 9)
            # wrap
            words, line, lines = self.body.split(), '', []
            max_w = self.width - 46
            for w in words:
                test = (line + ' ' + w).strip()
                if c.stringWidth(test, FONT, 9) > max_w:
                    lines.append(line); line = w
                else: line = test
            if line: lines.append(line)
            y = self.height - 32
            for ln in lines:
                c.drawString(46, y, ln); y -= 12
            c.setStrokeColor(HexColor('#D6D9CC')); c.setLineWidth(0.4)
            c.line(0, 0, self.width, 0)

    for n, t, b in rules:
        items.append(Rule(n, t, b)); items.append(sp(8))

    items.append(Paragraph('Czego unikamy', S['h2']))
    items.append(info_table([
        ['Unikaj', 'Zamiast tego'],
        ['„Rewolucjonizujemy..."',           '„Wdrażamy w 4 tygodnie"'],
        ['„Innowacyjne rozwiązanie AI"',      '„Automatyczne notatki ze spotkań"'],
        ['„Synergiczne podejście"',           '(usuń, nie zastępuj)'],
        ['„State-of-the-art modele"',         '„GPT-4 + Twoje dane"'],
        ['„Transformacja cyfrowa"',           '„Jeden workflow zamiast pięciu narzędzi"'],
        ['„Skalowalna platforma"',            '(co konkretnie skaluje? powiedz to)'],
        ['Strona bierna („czas jest oszczędzany")', 'Aktywna („Ty oszczędzasz czas")'],
    ], [CW / 2, CW / 2]))

    items.append(Paragraph('Nagłówki — przykłady', S['h2']))
    items.append(info_table([
        ['✗ Źle', '✓ Dobrze'],
        ['„Innowacyjne AI dla Twojej firmy"',          '„Wdrażamy AI, które po prostu działa"'],
        ['„Kompleksowe rozwiązania automatyzacji"',     '„Koniec ręcznego przepisywania danych"'],
        ['„Transformujemy Twój biznes z AI"',           '„32% czasu tygodniowo z powrotem w Twoich rękach"'],
        ['„Zaawansowane narzędzia dla profesjonalistów"', '„Kancelaria prawna: automatyczne notatki, mniej papierkologii"'],
        ['„Skontaktuj się z nami"',                     '„Zacznij od bezpłatnego audytu"'],
    ], [CW / 2, CW / 2]))

    items.append(Paragraph('Metryki — jak je używać', S['h2']))
    for r in [
        'Zawsze konkretna liczba: <b>+32%</b>, <b>45+ godzin</b>, <b>4 tygodnie</b>, <b>24/7</b>.',
        'Podaj kontekst: <i>„+32% odzyskanego czasu przy typowym wdrożeniu automatyzacji"</i>.',
        'Unikaj zaokrągleń marketingowych: <b>18.7%</b> brzmi wiarygodniej niż „prawie 20%".',
        'Jeśli liczba pochodzi od klienta — podaj źródło (case study, nazwisko, firma).',
    ]:
        items.append(Paragraph(f'•  {r}', S['body']))

    return items


def section_marketing():
    items = section_opener('08', 'Materiały', 'Marketing & Social')

    items.append(Paragraph('Hero — mock sekcji', S['section_label']))
    items.append(Paragraph('Wizualizacja struktury sekcji hero na stronie głównej.', S['body_muted']))
    items.append(HeroMock())
    items.append(sp(14))

    items.append(Paragraph('Karty usług — układ à la carte', S['section_label']))
    items.append(Paragraph('Karty na białym tle, sage page, mono kicker, lime CTA.', S['body_muted']))
    services_grid = Table([[
        CardMock(CW / 3 - 6, 140, 'Audyt AI',
                 '32% czasu do odzyskania w pierwszym miesiącu wdrożenia.',
                 cta='Umów audyt', mono_label='01 / Usługa'),
        CardMock(CW / 3 - 6, 140, 'Automatyzacja',
                 'Jeden workflow zamiast pięciu narzędzi. Koniec ręcznego przepisywania.',
                 cta='Zobacz case', mono_label='02 / Usługa'),
        CardMock(CW / 3 - 6, 140, 'Agenci AI',
                 'Pierwsza linia obsługi 24/7. Klient ma odpowiedź o 3 w nocy.',
                 cta='Dowiedz się', mono_label='03 / Usługa'),
    ]], colWidths=[CW / 3, CW / 3, CW / 3])
    services_grid.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    items.append(services_grid)
    items.append(sp(14))

    items.append(Paragraph('Sekcja rezultatów — układ metryk', S['section_label']))
    items.append(Paragraph('IBM Plex Mono dla numerów. Czarne na sage, akcent Lime na kluczowych liczbach.', S['body_muted']))

    class MetricsMock(Flowable):
        def __init__(self, width=CW, height=130):
            super().__init__()
            self.width, self.height = width, height
        def draw(self):
            c = self.canv
            c.setFillColor(SAGE)
            c.roundRect(0, 0, self.width, self.height, 14, fill=1, stroke=0)
            c.setFillColor(MUTED_DARK)
            c.setFont(FONT_MONO, 7)
            c.drawString(20, self.height - 24, '04  /  REZULTATY')
            c.setFillColor(DARK)
            c.setFont(FONT_BOLD, 16)
            c.drawString(20, self.height - 48, 'Mierzalnie, nie obietnicami.')
            metrics = [('+32%', 'odzyskanego czasu'),
                       ('45+',  'godzin/miesiąc'),
                       ('4 tyg.', 'do wdrożenia'),
                       ('24/7',  'pierwsza linia')]
            col_w = (self.width - 40) / len(metrics)
            for i, (n, lbl) in enumerate(metrics):
                x = 20 + i * col_w
                c.setFillColor(LIME if i == 0 else DARK)
                c.setFont(FONT_BOLD, 28)
                c.drawString(x, 30, n)
                c.setFillColor(MUTED_DARK)
                c.setFont(FONT, 8)
                c.drawString(x, 16, lbl)

    items.append(MetricsMock())
    items.append(sp(14))

    items.append(Paragraph('LinkedIn — kreacje', S['section_label']))
    items.append(Paragraph('Trzy dopuszczone tła: sage, czarne, białe. Jeden lime akcent.', S['body_muted']))

    class LinkedInPost(Flowable):
        def __init__(self, w, h, bg, fg, accent_text, body_text, kind='sage'):
            super().__init__()
            self.width, self.height = w, h
            self.bg, self.fg = bg, fg
            self.accent_text = accent_text
            self.body_text = body_text
            self.kind = kind
        def draw(self):
            c = self.canv
            c.setFillColor(self.bg)
            c.roundRect(0, 0, self.width, self.height, 10, fill=1, stroke=0)
            # logo
            c.setFillColor(self.fg)
            c.setFont(FONT_BOLD, 9)
            c.drawString(12, self.height - 18, 'Workshift')
            # accent text (lime highlight)
            c.setFillColor(LIME)
            c.setFont(FONT_BOLD, 18)
            c.drawString(12, self.height - 52, self.accent_text)
            # body
            c.setFillColor(self.fg)
            c.setFont(FONT_BOLD, 11)
            words, line, lines = self.body_text.split(), '', []
            for w in words:
                test = (line + ' ' + w).strip()
                if c.stringWidth(test, FONT_BOLD, 11) > self.width - 24:
                    lines.append(line); line = w
                else: line = test
            if line: lines.append(line)
            y = self.height - 72
            for ln in lines[:3]:
                c.drawString(12, y, ln); y -= 14
            # tag
            c.setFillColor(LIME)
            c.roundRect(12, 12, 80, 16, 8, fill=1, stroke=0)
            c.setFillColor(DARK)
            c.setFont(FONT_MED, 7)
            c.drawString(22, 17, '#WorkshiftAI')

    li_row = Table([[
        LinkedInPost(CW / 3 - 6, 150, SAGE, DARK, '+32%',
                     'czasu odzyskane w typowej kancelarii prawnej po 4 tygodniach.'),
        LinkedInPost(CW / 3 - 6, 150, DARK, WHITE, '45+ godz.',
                     'oszczędzonych miesięcznie. AI w e-commerce — case Bednarz Group.'),
        LinkedInPost(CW / 3 - 6, 150, WHITE, DARK, '24/7',
                     'Agent AI obsługuje pierwszą linię. Klient zadaje pytanie o 3 w nocy.'),
    ]], colWidths=[CW / 3, CW / 3, CW / 3])
    li_row.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    items.append(li_row)
    items.append(sp(14))

    items.append(Paragraph('Social Media (LinkedIn)', S['h2']))
    items.append(info_table([
        ['Parametr', 'Wartość'],
        ['Tło grafik', 'Sage #E6E8DD lub Black #000000 lub White #FFFFFF'],
        ['Kolor akcentu', 'Lime #9CE069 — jeden akcent na grafikę'],
        ['Font nagłówek', 'Inter Bold'],
        ['Font treść', 'Inter Regular'],
        ['Font metryki', 'IBM Plex Mono lub Inter Bold + Lime'],
        ['Tone', 'Jeden konkretny insight per post (nie „5 rzeczy o AI")'],
        ['Struktura', 'Liczba/wynik w pierwszym zdaniu → kontekst → CTA'],
        ['Format LinkedIn post', '1200 × 627 px'],
        ['Format square', '1080 × 1080 px'],
        ['Format LinkedIn banner', '1584 × 396 px'],
    ], [160, CW - 160]))

    items.append(Paragraph('Prezentacje (pitch deck, oferty)', S['h2']))
    items.append(info_table([
        ['Element', 'Wytyczna'],
        ['Tło slajdu', 'Sage #E6E8DD lub White'],
        ['Nagłówki slajdów', 'Inter Bold 36–48px'],
        ['Treść slajdów', 'Inter Regular 16–20px'],
        ['Metryki / liczby', 'IBM Plex Mono lub Inter Bold z Lime accent'],
        ['Jeden punkt na slajd', 'Nie pakuj więcej — duże liczby jako hero element'],
        ['Zdjęcia', 'Jasne, minimalistyczne lub czarno-białe — bez stockowych „uśmiechniętych biznesmenów"'],
        ['Unikaj', 'Gradientów tła, wielu kolorów akcent naraz'],
    ], [160, CW - 160]))

    return items


def section_screens():
    items = section_opener('09', 'Strona', 'Live screens')

    items.append(Paragraph(
        'Sekcje strony głównej <font name="PlexMono">workshift.pl</font> '
        '— widok mobilny. Pokazują system tokenów w praktyce: paleta sage/lime, '
        'hierarchia typograficzna, karty na białym tle, gradient dividers między sekcjami.',
        S['body']))
    items.append(sp(14))

    screens = [
        ('01-hero',     'Hero',           'Headline + CTA — najsilniejszy moment marki'),
        ('02-services', 'Usługi',         'Karty à la carte z metryką w IBM Plex Mono'),
        ('03-process',  'Proces',         'Kroki wdrożenia — numeracja w mono'),
        ('04-results',  'Rezultaty',      'Mierzalne liczby — central w komunikacji'),
        ('05-cases',    'Case studies',   'Karty z opiniami klientów na białym tle'),
        ('06-contact',  'Kontakt',        'Formularz + dane — sage bg, lime CTA'),
    ]

    from PIL import Image as PilImg

    # Render screens as a 3-column grid: thumb (image with caption underneath).
    # Two rows of three per page.
    target_w = (CW - 2 * 14) / 3   # 3 cols, two 14pt gutters
    cells_per_page = 3   # 3 columns x 2 rows on one page

    def screen_cell(slug, title, caption):
        path = f'/tmp/brand-screens/{slug}.png'
        with PilImg.open(path) as im:
            w, h = im.size
        img_h = target_w * h / w
        # Cap height so 2 rows fit per page
        max_h = 320
        iw, ih = target_w, img_h
        if ih > max_h:
            ih = max_h
            iw = ih * w / h
        img = RLImage(path, width=iw, height=ih)
        return [
            img,
            Spacer(1, 6),
            Paragraph(f'<font name="PlexMono" color="#7bc44a">{slug.split("-")[0]}</font>  ·  <b>{title}</b>',
                      style('sc', fontSize=9, leading=11)),
            Paragraph(caption, S['caption']),
        ]

    rows = []
    for i in range(0, len(screens), 3):
        row_cells = []
        for j in range(3):
            if i + j < len(screens):
                row_cells.append(screen_cell(*screens[i + j]))
            else:
                row_cells.append('')
        rows.append(row_cells)

    grid = Table(rows, colWidths=[target_w + 14, target_w + 14, target_w + 14])
    grid.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
    ]))
    items.append(grid)

    return items


def section_files():
    items = section_opener('10', 'Reference', 'Pliki techniczne')
    items.append(Paragraph(
        'Mapa plików source-of-truth — patrz repozytorium '
        '<font name="PlexMono">workshift-landing</font>.',
        S['body']))
    items.append(info_table([
        ['Plik', 'Zawartość'],
        ['src/index.css',            'Source of truth — Tailwind CSS v4 @theme tokens'],
        ['design-system.css',        'CSS reference / dokumentacja aktualnego systemu'],
        ['BRAND.md',                 'Pełna wersja brand booka w Markdown (długa)'],
        ['brand.md',                 'Wersja lekka dla agentów AI (kompresowana, szybka)'],
        ['BRAND.pdf',                'Ten dokument — pełny brand book PDF'],
        ['src/components/ui/',       'Komponenty CVA + BaseUI primitives'],
        ['public/brand-assets/',     'Logo SVG/PNG (light/dark/icon)'],
        ['scripts/generate_brand_pdf.py', 'Generator tego PDF — odpalaj po zmianach BRAND.md'],
        ['design-system-legacy.css', 'LEGACY — stary system (Satoshi + Orange + Navy). NIE używać.'],
    ], [200, CW - 200]))

    items.append(Paragraph('Pierwsze kroki przy nowym materiale', S['h2']))
    for s in [
        '<b>1.</b>  Zacznij od koloru tła — Sage (#E6E8DD) lub Black (#000000). Nie mieszaj.',
        '<b>2.</b>  Jeden akcent Lime na widok — to ma być CTA lub kluczowa metryka.',
        '<b>3.</b>  Typografia: tylko Inter. Mono tylko dla liczb i etykiet technicznych.',
        '<b>4.</b>  Hierarchia nagłówków: tracking-tight, font-weight 400 (nie bold).',
        '<b>5.</b>  Treść w pierwszej osobie liczby mnogiej („wdrażamy", „wiemy"). Krótkie zdania.',
        '<b>6.</b>  Metryki konkretne: <b>+32%</b>, <b>45+ godzin</b>, <b>4 tygodnie</b> — nie „znacznie", „bardzo".',
    ]:
        items.append(Paragraph(s, S['body']))

    items.append(sp(20))
    items.append(GradientDivider(CW, height=3))
    items.append(sp(10))
    items.append(Paragraph(
        '<i>Workshift — Brand Book & Design System  ·  v1.1  ·  maj 2026  ·  finalne</i>',
        S['caption']))
    items.append(Paragraph(
        'Pytania, korekty, sugestie:  '
        '<font name="PlexMono">kontakt@workshift.pl</font>',
        S['caption']))

    return items


# ─────────────────────────────────────────────────────────────────────────────
# ASSEMBLE
# ─────────────────────────────────────────────────────────────────────────────

OUTPUT = os.path.join(ROOT, 'BRAND.pdf')

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

story = [PageBreak()]   # cover handled by on_first_page; force content to next page
story += section_marka()      + [PageBreak()]
story += section_logo()       + [PageBreak()]
story += section_colors()     + [PageBreak()]
story += section_typography() + [PageBreak()]
story += section_layout_effects() + [PageBreak()]
story += section_ui()         + [PageBreak()]
story += section_tov()        + [PageBreak()]
story += section_marketing()  + [PageBreak()]
story += section_files()

doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
print(f'✓  PDF wygenerowany: {OUTPUT}')
print(f'   Rozmiar: {os.path.getsize(OUTPUT) // 1024} KB')
