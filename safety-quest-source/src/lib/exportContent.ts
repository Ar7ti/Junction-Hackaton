// Builds a readable Word document of all Safety Quest missions and safety content.
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import { BADGES, LEVELS, SCENARIOS, scenariosForLevel, type Scenario } from "./gameData";

const bullet = (text: string): Paragraph =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun(text)],
  });

function scenarioParagraphs(s: Scenario): Paragraph[] {
  const out: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(`${s.emoji} ${s.title}`)],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Game type: ", bold: true }),
        new TextRun(s.mechanicLabel),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "Story: ", bold: true }), new TextRun(s.intro)],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Learning goal: ", bold: true }),
        new TextRun(s.objective),
      ],
    }),
  ];

  if (s.spotItems) {
    out.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun(`Scene: ${s.sceneLabel ?? ""}`)],
      }),
      new Paragraph({
        children: [new TextRun({ text: "Hazards to find:", bold: true })],
      }),
      ...s.spotItems
        .filter((i) => i.hazard)
        .map((i) =>
          bullet(`${i.emoji} ${i.label} — ${i.praise ?? ""} Fix: ${i.fix ?? ""}`),
        ),
      new Paragraph({
        children: [
          new TextRun({
            text: `Safe decoys in the scene: ${s.spotItems
              .filter((i) => !i.hazard)
              .map((i) => `${i.emoji} ${i.label}`)
              .join(", ")}`,
            italics: true,
          }),
        ],
      }),
    );
  }

  if (s.sortCards) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Situations to sort:", bold: true })],
      }),
      ...s.sortCards.map((c) =>
        bullet(`${c.emoji} ${c.text} — ${c.safe ? "🟢 SAFE" : "🔴 RISKY"}: ${c.why}`),
      ),
    );
  }

  if (s.chain) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Risk chain (in order):", bold: true })],
      }),
      ...s.chain.map((c, i) =>
        new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: [new TextRun(c)],
        }),
      ),
    );
    if (s.chainHint) {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: `Hint given to players: ${s.chainHint}`, italics: true })],
        }),
      );
    }
  }

  if (s.actionSteps) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Decisions the player makes:", bold: true })],
      }),
    );
    s.actionSteps.forEach((step, i) => {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${i + 1}. ${step.emoji} ${step.situation}`, bold: true }),
          ],
        }),
        ...step.options.map((o) =>
          bullet(`${o.correct ? "✅" : "❌"} ${o.text} — ${o.feedback}`),
        ),
      );
    });
  }

  if (s.storySteps) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Story and choices:", bold: true })],
      }),
    );
    s.storySteps.forEach((step, i) => {
      out.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${step.speaker ? `${step.speaker}: ` : ""}${step.text}`,
              bold: true,
            }),
          ],
        }),
        ...step.choices.map((c) =>
          bullet(`${c.correct ? "✅" : "❌"} ${c.text} — ${c.feedback}`),
        ),
      );
    });
  }

  out.push(
    new Paragraph({
      children: [new TextRun({ text: "Talk about it (for parents & guardians):", bold: true })],
    }),
    ...s.talkAboutIt.map(bullet),
  );

  return out;
}

export async function exportSafetyQuestDoc(): Promise<void> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Safety Quest", bold: true, size: 56, font: "Arial" }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "Become a Risk Detective — full mission & safety content",
          size: 28,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun(
          "Safety Quest is an educational game that teaches children aged 5–15 to spot risks, " +
            "make safer choices and prevent everyday accidents. This document contains every " +
            "mission, its learning goal, the safety content, and the discussion prompts for " +
            "parents and guardians.",
        ),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Badges players can earn: ", bold: true }),
        new TextRun(BADGES.map((b) => `${b.emoji} ${b.name} (${b.desc})`).join(" · ")),
      ],
    }),
  ];

  LEVELS.forEach((level, li) => {
    children.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun(`${level.emoji} Level ${level.id}: ${level.name} (${level.ages})`)],
      }),
      new Paragraph({
        children: [new TextRun({ text: level.tagline, italics: true })],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Skill the child learns: ", bold: true }),
          new TextRun(level.skill),
        ],
      }),
    );
    scenariosForLevel(level.id).forEach((s) => children.push(...scenarioParagraphs(s)));
    if (li === LEVELS.length - 1) {
      children.push(
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "🛡️ Safety Quest is supported by LähiTapiola as a safety partner.",
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Insurance helps when something goes wrong — safety skills help prevent it from going wrong in the first place.",
              italics: true,
            }),
          ],
        }),
      );
    }
  });

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 36, bold: true, font: "Arial", color: "1D4ED8" },
          paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 30, bold: true, font: "Arial", color: "0F766E" },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 26, bold: true, font: "Arial" },
          paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
        {
          reference: "numbers",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "safety-quest-content.docx");
}
