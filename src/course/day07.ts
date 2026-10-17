import type { CourseDay } from './types'
import { week1 } from './week1'
import { day02 } from './day02'
import { day03 } from './day03'
import { day04 } from './day04'
import { day05 } from './day05'
import { day06 } from './day06'
const review: CourseDay = {
  "day": 7,
  "week": 1,
  "kind": "review",
  "theme": "Wiederholen und übertragen",
  "title": "Rückblick: Meine neue Stimme",
  "estimatedMinutes": 120,
  "input": "Heute liest du keinen neuen Fachtext. Du arbeitest mit deinen eigenen Antworten aus den vergangenen sechs Tagen. Öffne zunächst unter „Mein Lernen“ deinen Text vom ersten Tag. Lies ihn einmal, ohne etwas zu korrigieren. Notiere danach drei Aussagen, die du heute noch genauso vertreten würdest, und eine Aussage, die du inzwischen genauer formulieren möchtest. Deine Aufgabe besteht darin, einen sichtbaren Unterschied zwischen erster Fassung und überarbeiteter Fassung herzustellen.\n\nNimm dann die Perspektive aus Tag 2 ein. Wo vermischst du eine damalige Erfahrung mit deiner heutigen Bewertung? Ergänze eine Formulierung wie „Damals ging ich davon aus“ oder „Erst später stellte sich heraus“. Prüfe, ob der Satz tatsächlich eine zeitliche Unterscheidung enthält. Eine neue Wendung allein macht einen Text nicht genauer. Sie muss eine Information ordnen, die vorher unklar blieb.\n\nIm nächsten Schritt betrachtest du eine Meinung aus deiner Antwort. Unterstreiche gedanklich die These und ihre Begründung. Welche Behauptung gilt nur unter bestimmten Bedingungen? Formuliere diese Bedingung ausdrücklich. Überlege auch, was eine andere Person vernünftigerweise dagegen einwenden könnte. Antworte auf dieses Gegenargument, ohne es zu einer offensichtlich falschen Position zu vereinfachen.\n\nNun wechselst du vom Schreiben zum Sprechen. Stell dir vor, jemand sagt: „Wer früher Deutsch studiert hat, müsste doch sofort wieder fließend sprechen können.“ Antworte zunächst frei. Erkenne an, welcher Gedanke daran nachvollziehbar ist, und grenze anschließend deinen Widerspruch ein. Verwende eine konkrete Erfahrung, aber behaupte nicht, dass deine Erfahrung für alle Menschen gilt.\n\nFür die zweite Gesprächssituation nutzt du das Muster aus Tag 5. Eine Person unterbricht dich regelmäßig, wenn du nach einer Formulierung suchst. Beschreibe eine konkrete Beobachtung, erkläre ihre Wirkung auf dich und äußere eine Bitte. Vermeide Vermutungen über die Absicht der anderen Person. Vereinbare stattdessen ein Verhalten, das beide beim nächsten Gespräch erkennen können.\n\nZum Abschluss überprüfst du deine Lernvereinbarung. Welche Aufgabe hast du tatsächlich bearbeitet? Welche Veränderung kannst du an einem Beispiel zeigen? Wähle genau einen Schwerpunkt für die nächste Woche. Formuliere ihn als Handlung, etwa: „Ich werde nach einer Begründung ein mögliches Gegenargument ergänzen.“ Bewahre deine erste und deine neue Fassung auf. Der Vergleich soll dir Orientierung geben; er ist weder ein Sprachzertifikat noch eine automatische Bewertung.",
  "questions": [
    {
      "prompt": "Überarbeite eine Aussage aus Tag 1 mit einer zeitlichen Unterscheidung.",
      "answer": "Damals ging ich davon aus, dass mein Wortschatz sofort verfügbar bliebe; erst später merkte ich, dass aktives Sprechen Übung braucht.",
      "explanation": "Vergleiche mit Tag 2: Der Satz trennt frühere Annahme und spätere Erkenntnis. Nutze für deine eigene Antwort eine tatsächlich passende Erfahrung."
    },
    {
      "prompt": "Formuliere eine These aus deinem Text mit einer Bedingung.",
      "answer": "Ein fester Lernplan hilft mir, sofern er nach einem ausgefallenen Tag eine Fortsetzung ermöglicht.",
      "explanation": "Die Bedingung begrenzt den Geltungsbereich, wie an Tag 3 geübt."
    },
    {
      "prompt": "Antworte höflich auf die Behauptung über ehemalige Germanistikstudierende.",
      "answer": "Ich kann die Erwartung nachvollziehen; sie berücksichtigt allerdings nicht, dass Wissen und spontaner Zugriff unterschiedliche Dinge sind.",
      "explanation": "Die Antwort erkennt einen Gedanken an und kritisiert eine konkrete Annahme."
    },
    {
      "prompt": "Formuliere eine Bitte an eine Person, die dich unterbricht.",
      "answer": "Wenn du meinen Satz ergänzt, bevor ich fertig bin, verliere ich meinen Gedankengang. Bitte gib mir beim nächsten Mal etwas Zeit.",
      "explanation": "Beobachtung, Wirkung und Bitte ersetzen ein Urteil über fremde Absichten."
    },
    {
      "prompt": "Benenne einen beobachtbaren Fortschritt dieser Woche.",
      "answer": "In meiner zweiten Aufnahme nenne ich zuerst die These und anschließend zwei Gründe; in der ersten Fassung war die Reihenfolge unklar.",
      "explanation": "Ein konkreter Vergleich ist aussagekräftiger als „Ich bin besser geworden“."
    },
    {
      "prompt": "Leite daraus einen Schwerpunkt für die nächste Woche ab.",
      "answer": "Ich werde zu jeder Position eine Einschränkung und ein mögliches Gegenargument formulieren.",
      "explanation": "Der Schwerpunkt nennt eine wiederholbare Handlung statt eines unbestimmten Wunsches."
    }
  ],
  "expressions": [],
  "output": "Verfasse eine neue Version deiner Antwort aus Tag 1 (180–220 Wörter) und ergänze darunter drei konkrete Unterschiede zur ersten Fassung. Alternativ: Sprich die neue Version 3–5 Minuten und notiere die drei Unterschiede. Verwende eine zeitliche Unterscheidung, ein begründetes Ziel und eine Einschränkung.",
  "modelAnswer": "Während meines Studiums war Deutsch für mich vor allem eine Sprache, in der ich anspruchsvolle Texte untersuchte und Gedanken entwickelte. Nach dem Abschluss nutzte ich sie jedoch immer seltener. Damals ging ich davon aus, dass meine Fähigkeiten ohne regelmäßige Anwendung weitgehend verfügbar bleiben würden. Erst später merkte ich, wie stark sich Verstehen und spontanes Sprechen unterscheiden können.\n\nHeute möchte ich an mein vorhandenes Wissen anknüpfen. Mein Ziel ist, Erfahrungen zusammenhängend zu erzählen und eine Meinung so zu begründen, dass andere meine Voraussetzungen nachvollziehen können. Dabei geht es mir nicht darum, jeden Satz besonders kompliziert zu gestalten. Entscheidend ist, dass meine Gedanken klar miteinander verbunden sind.\n\nIch halte eine feste Lernroutine für hilfreich, sofern sie auch nach einer Unterbrechung fortgesetzt werden kann. Ein ausgefallener Abend soll deshalb nicht den gesamten Plan infrage stellen. Zugleich möchte ich meinen Fortschritt an konkreten Antworten prüfen, statt nur Lernminuten zu sammeln.\n\nIm Vergleich zu meiner ersten Fassung trenne ich nun deutlicher zwischen einer früheren Annahme und meiner heutigen Einschätzung. Außerdem benenne ich zwei Fähigkeiten, an denen ich arbeiten möchte. Schließlich begrenze ich meine Erwartungen: Nach wenigen Wochen erwarte ich keine perfekte Sprache, sondern einen erkennbar sichereren Umgang mit vertrauten Themen.",
  "selfCheck": [
    "Habe ich meine erste Fassung tatsächlich verglichen?",
    "Kann ich drei konkrete Veränderungen benennen?",
    "Verwende ich frühere Wendungen mit passender Bedeutung?",
    "Ist mein nächster Schwerpunkt als Handlung formuliert?"
  ]
}
review.expressions = [week1[0].expressions[4], week1[0].expressions[5], day02.expressions[0], day02.expressions[1], day03.expressions[0], day03.expressions[8], day04.expressions[0], day04.expressions[7], day05.expressions[8], day06.expressions[8]]
export const day07 = review
