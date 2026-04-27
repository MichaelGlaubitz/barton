import arrowsRightLeft from 'heroicons/24/outline/arrows-right-left.svg?raw';
import arrowsUpDown from 'heroicons/24/outline/arrows-up-down.svg?raw';
import arrowUturnLeft from 'heroicons/24/outline/arrow-uturn-left.svg?raw';
import barsArrowDown from 'heroicons/24/outline/bars-arrow-down.svg?raw';
import bolt from 'heroicons/24/outline/bolt.svg?raw';
import chatBubbleLeftRight from 'heroicons/24/outline/chat-bubble-left-right.svg?raw';
import clipboardDocumentList from 'heroicons/24/outline/clipboard-document-list.svg?raw';
import clock from 'heroicons/24/outline/clock.svg?raw';
import documentText from 'heroicons/24/outline/document-text.svg?raw';
import exclamationTriangle from 'heroicons/24/outline/exclamation-triangle.svg?raw';
import eye from 'heroicons/24/outline/eye.svg?raw';
import flag from 'heroicons/24/outline/flag.svg?raw';
import key from 'heroicons/24/outline/key.svg?raw';
import language from 'heroicons/24/outline/language.svg?raw';
import magnifyingGlass from 'heroicons/24/outline/magnifying-glass.svg?raw';
import pencilSquare from 'heroicons/24/outline/pencil-square.svg?raw';
import rectangleGroup from 'heroicons/24/outline/rectangle-group.svg?raw';
import scale from 'heroicons/24/outline/scale.svg?raw';
import sparkles from 'heroicons/24/outline/sparkles.svg?raw';
import ticket from 'heroicons/24/outline/ticket.svg?raw';
import viewColumns from 'heroicons/24/outline/view-columns.svg?raw';

function withIconClass(svg: string): string {
	return svg.replace('<svg ', '<svg class="hack-card__icon" ');
}

const defaultIcon = withIconClass(sparkles);

/** Heroicons 24×24 Outline, stroke currentColor — pro Hack passend zugeordnet */
const byHackId: Record<string, string> = {
	'abruf-ueben': withIconClass(bolt),
	'zeitlicher-abstand': withIconClass(clock),
	'vorwissen-diagnose': withIconClass(magnifyingGlass),
	'exit-tickets': withIconClass(ticket),
	'geloestes-beispiel': withIconClass(documentText),
	'beispielfamilien': withIconClass(rectangleGroup),
	'repraesentationen-wechseln': withIconClass(viewColumns),
	'vergleichsaufgaben': withIconClass(arrowsUpDown),
	'aufgaben-stufen-oeffnen': withIconClass(barsArrowDown),
	'themen-vermischen': withIconClass(arrowsRightLeft),
	'zweckvolle-uebung': withIconClass(flag),
	'feedback-handlungsnah': withIconClass(arrowUturnLeft),
	'leitfragen-selbstkontrolle': withIconClass(clipboardDocumentList),
	'hinge-questions': withIconClass(key),
	'mini-whiteboards': withIconClass(pencilSquare),
	'fehler-lernen': withIconClass(exclamationTriangle),
	'fehler-vorhersagen': withIconClass(eye),
	'fragetechnik': withIconClass(chatBubbleLeftRight),
	'sprachsensibel-erklaeren': withIconClass(language),
	'kognitive-last': withIconClass(scale),
	'lernziel-loesungswege-vorwegdenken': withIconClass(flag),
	'arbeitsphasen-zielgerichtet-beobachten': withIconClass(eye),
	'beitraege-fuers-plenum-auswaehlen': withIconClass(viewColumns),
	'praesentationen-sequenzieren': withIconClass(barsArrowDown),
	'schuelerideen-mit-lernziel-verbinden': withIconClass(arrowsRightLeft),
	'diskussion-braucht-hochlevel-aufgabe': withIconClass(flag),
	'denkzeit-vor-partnerarbeit': withIconClass(clock),
	'monitoring-chart-diskussion': withIconClass(clipboardDocumentList),
	'vertiefungsfragen-nachfassen': withIconClass(arrowUturnLeft),
	'denkendes-klassenzimmer': withIconClass(sparkles),
	'problemaufgaben-denken-zwingen': withIconClass(flag),
	'vertikal-wechselnde-flaechen': withIconClass(viewColumns),
	'sichtbar-zufaellige-gruppen': withIconClass(rectangleGroup),
	'btc-stufe-eins-kleine-brueche': withIconClass(bolt),
	'front-load-beteiligung': withIconClass(chatBubbleLeftRight),
	'wartezeit-verlaengern': withIconClass(clock),
	'acht-von-zehn': withIconClass(magnifyingGlass),
	'niemals-aufrunden': withIconClass(scale),
	'ich-weiss-nicht-produktiv': withIconClass(chatBubbleLeftRight),
	'selbsterklaerung-impuls': withIconClass(key),
	'vergessenskurve-zeigen': withIconClass(clock),
	'whole-class-feedback': withIconClass(clipboardDocumentList),
};

const emojiByHackId: Record<string, string> = {
	'abruf-ueben': '⚡',
	'zeitlicher-abstand': '🕒',
	'vorwissen-diagnose': '🔎',
	'exit-tickets': '🎫',
	'geloestes-beispiel': '🧩',
	'beispielfamilien': '🧱',
	'repraesentationen-wechseln': '🔁',
	'vergleichsaufgaben': '⚖️',
	'aufgaben-stufen-oeffnen': '🪜',
	'themen-vermischen': '🧠',
	'zweckvolle-uebung': '🎯',
	'feedback-handlungsnah': '💬',
	'leitfragen-selbstkontrolle': '✅',
	'hinge-questions': '🚦',
	'mini-whiteboards': '📝',
	'fehler-lernen': '🛠️',
	'fehler-vorhersagen': '🔮',
	'fragetechnik': '❓',
	'sprachsensibel-erklaeren': '🗣️',
	'kognitive-last': '🪶',
	'lernziel-loesungswege-vorwegdenken': '🎯',
	'arbeitsphasen-zielgerichtet-beobachten': '👀',
	'beitraege-fuers-plenum-auswaehlen': '🎛️',
	'praesentationen-sequenzieren': '🔀',
	'schuelerideen-mit-lernziel-verbinden': '🔗',
	'diskussion-braucht-hochlevel-aufgabe': '📈',
	'denkzeit-vor-partnerarbeit': '🤔',
	'monitoring-chart-diskussion': '📋',
	'vertiefungsfragen-nachfassen': '🔁',
	'denkendes-klassenzimmer': '💡',
	'problemaufgaben-denken-zwingen': '🧩',
	'vertikal-wechselnde-flaechen': '⬆️',
	'sichtbar-zufaellige-gruppen': '🎲',
	'btc-stufe-eins-kleine-brueche': '🪜',
	'front-load-beteiligung': '📣',
	'wartezeit-verlaengern': '⏳',
	'acht-von-zehn': '🙋',
	'niemals-aufrunden': '🎯',
	'ich-weiss-nicht-produktiv': '🚪',
	'selbsterklaerung-impuls': '🗝️',
	'vergessenskurve-zeigen': '📉',
	'whole-class-feedback': '🗂️',
};

export function hackCardIconMarkup(hackId: string): string {
	return byHackId[hackId] ?? defaultIcon;
}

export function hackEmoji(hackId: string): string {
	return emojiByHackId[hackId] ?? '✨';
}
