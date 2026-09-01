/**
 * The three recorded runs behind /usecase.
 *
 * Generated — do not hand-edit. Run `node script/usecase-runs.mjs` after the
 * recorder on the workstation drops a new `client/public/usecase/data.js`.
 *
 * The stages, their order, the lines they printed and the files they produced
 * are exactly what three real runs did. French for every string here lives in
 * `lib/fr/usecase.ts`, keyed on the English.
 */

export type UseCaseStage = {
  label: string;
  /** The lines the stage printed, in the order it printed them. */
  notes: string[];
};

export type UseCaseRun = {
  id: string;
  /** Short label on the tab. */
  tab: string;
  sector: string;
  who: string;
  title: string;
  problem: string;
  /** What the run caught that a person would have missed. `catch` is reserved. */
  caught: string;
  /** How long the real run took, in seconds. */
  real: number;
  stages: UseCaseStage[];
  summary: { key: string; value: string }[];
  downloads: { name: string; size: number; kind: string; href: string }[];
};

export const USE_CASE_RUNS: UseCaseRun[] = [
  {
    id: "return",
    tab: "Regulatory return",
    sector: "Banking and insurance",
    who: "Ashcombe Mutual, a building society",
    title: "The quarterly return nobody can check by hand",
    problem: "Sixty-two thousand rows arrive from the core system every quarter, and some of them are wrong. Amounts held as text. Branch codes that are not on the master list. Dates that are not dates. Eight rules decide what can be reported, and somebody has to be able to defend every figure in it.",
    caught: "Nine hundred and nine problems, found before a single figure was published. A hundred and thirty-three records could not be trusted and were left out, each one named. And seventeen exposures crossed the large-exposure threshold, so they went to a person. The system does not make that call.",
    real: 3.13,
    stages: [
      {
        label: "Loading source data",
        notes: [
          "exposure_extract_raw.xlsx (3 MB)",
          "62,400 records loaded",
          "11 columns",
        ],
      },
      {
        label: "Loading the branch master",
        notes: [
          "18 branches in master list",
        ],
      },
      {
        label: "Applying the reporting rules",
        notes: [
          "8 rules applied to every record",
          "909 issues identified (1.46% of records)",
          "759 repaired and reported",
          "133 excluded from reported figures",
          "17 referred to a person for a decision",
          "ground truth: 909 issues planted, matches",
        ],
      },
      {
        label: "Calculating the return",
        notes: [
          "4 regions and 6 products",
          "Total exposure £20,246,618,087",
          "Risk-weighted £16,001,104,374 (79.0% of gross)",
        ],
      },
      {
        label: "Building the Excel return pack",
        notes: [
          "Regulatory_Return_Pack.xlsx (18 KB) - 7 sheets",
        ],
      },
      {
        label: "Reading the figures back out of the workbook",
        notes: [
          "Read 'Return Summary' - tiles and position",
          "Read 'Regional Summary' - 4 regions",
          "Read 'Product Summary' - 6 products",
          "Read 'Exposure Trend' - 12 periods",
          "return_values.json written - every board figure comes from here",
        ],
      },
      {
        label: "Building the board pack",
        notes: [
          "Board_Exposure_Report.pptx (49 KB) - 5 slides",
        ],
      },
    ],
    summary: [
      { key: "Records reported", value: "62,267 of 62,400" },
      { key: "Issues identified", value: "909" },
      { key: "Gross exposure", value: "£20,246,618,087" },
      { key: "Referred to a person", value: "17" },
    ],
    downloads: [
      { name: "Regulatory_Return_Pack.xlsx", size: 18230, kind: "Excel workbook", href: "/usecase/files/return/Regulatory_Return_Pack.xlsx" },
      { name: "Board_Exposure_Report.pptx", size: 49981, kind: "PowerPoint deck", href: "/usecase/files/return/Board_Exposure_Report.pptx" },
    ],
  },
  {
    id: "screening",
    tab: "Application screening",
    sector: "Recruitment and HR",
    who: "Marlowe & Finch, an agency hiring for six roles",
    title: "Twelve hundred applications, and a reason for every no",
    problem: "Twelve hundred applications came in over three months, through five channels, for six jobs, and no two are written the same way. Seven rules do the screening, and they were written down before a single application arrived. That ordering is the whole point.",
    caught: "A hundred and forty-one applications did not go forward, and every one of them carries the rule that stopped it. If a candidate rings up in six weeks there is an answer, and it is the same answer for everybody. Nineteen asked above the approved band: not rejected, referred to a person.",
    real: 0.28,
    stages: [
      {
        label: "Loading applications",
        notes: [
          "applications_raw.xlsx (82 KB)",
          "1,240 applications received in the window",
        ],
      },
      {
        label: "Loading the role specs",
        notes: [
          "6 roles being hired for",
          "18 alternative spellings mapped",
        ],
      },
      {
        label: "Applying the screening rules",
        notes: [
          "7 rules applied to every application",
          "385 issues identified (31.0% of applications)",
          "225 tidied and kept in",
          "141 not progressed, each with a reason on record",
          "19 referred to a person",
          "ground truth: 385 conditions planted, matches",
        ],
      },
      {
        label: "Scoring and ranking",
        notes: [
          "1,099 applications scored out of 100",
          "top 6 per role shortlisted, 36 people in total",
        ],
      },
      {
        label: "Building the Excel shortlist pack",
        notes: [
          "Shortlist_Pack.xlsx (19 KB) - 6 sheets",
        ],
      },
      {
        label: "Reading the figures back out of the workbook",
        notes: [
          "Read 'Screening Summary' - tiles and totals",
          "Read 'Role Summary' - 6 roles",
          "shortlist_values.json written - every slide figure comes from here",
        ],
      },
      {
        label: "Building the hiring manager pack",
        notes: [
          "Hiring_Manager_Pack.pptx (41 KB) - 4 slides",
        ],
      },
    ],
    summary: [
      { key: "Applications", value: "1,240" },
      { key: "Not progressed", value: "141" },
      { key: "Shortlisted", value: "36" },
      { key: "Referred to a person", value: "19" },
    ],
    downloads: [
      { name: "Shortlist_Pack.xlsx", size: 19670, kind: "Excel workbook", href: "/usecase/files/screening/Shortlist_Pack.xlsx" },
      { name: "Hiring_Manager_Pack.pptx", size: 41475, kind: "PowerPoint deck", href: "/usecase/files/screening/Hiring_Manager_Pack.pptx" },
    ],
  },
  {
    id: "formats",
    tab: "Campaign artwork",
    sector: "Agencies and studios",
    who: "Fennel & Fig, a spring range",
    title: "One brief, fifty-nine sizes, five channels",
    problem: "One campaign has to ship in fifty-nine sizes across five channels. Every retailer sent their spec differently and half of them spell the channel another way. Seven rules carry the studio's standards, the ones that used to live in one person's head and get applied differently at eleven at night.",
    caught: "Seven formats were not built, and that is the useful part. One frame was so wide the product would have been cropped out of it. Two asked for type below the size anyone can read. Three headlines went to a copywriter, because that is a writing job, not a resizing job.",
    real: 2.98,
    stages: [
      {
        label: "Loading the format brief",
        notes: [
          "format_brief_raw.xlsx (8 KB)",
          "59 formats briefed",
        ],
      },
      {
        label: "Loading the brand standards",
        notes: [
          "Fennel & Fig, Spring Range 2026",
          "minimum type 14px, safe area 40px, headline limit 34 characters",
          "5 channels, 13 spellings mapped",
        ],
      },
      {
        label: "Applying the build rules",
        notes: [
          "7 rules applied to every format",
          "23 issues identified",
          "13 specs corrected and built",
          "7 held back, not built blind",
          "3 sent to a copywriter",
          "ground truth: 23 conditions planted, matches",
        ],
      },
      {
        label: "Rendering the assets",
        notes: [
          "52 assets written to outputs/assets/",
          "5 channels, 64.8 megapixels rendered",
          "contact_sheet.png (591 KB)",
        ],
      },
      {
        label: "Building the Excel register",
        notes: [
          "Format_Register.xlsx (16 KB) - 6 sheets",
        ],
      },
      {
        label: "Reading the figures back out of the workbook",
        notes: [
          "Read 'Build Summary' - tiles and totals",
          "Read 'Channel Summary' - 5 channels",
          "format_values.json written - every slide figure comes from here",
        ],
      },
      {
        label: "Building the studio pack",
        notes: [
          "Studio_Handover_Pack.pptx (40 KB) - 4 slides",
        ],
      },
    ],
    summary: [
      { key: "Formats briefed", value: "59" },
      { key: "Assets built", value: "52" },
      { key: "Held back", value: "7" },
      { key: "With a copywriter", value: "3" },
    ],
    downloads: [
      { name: "Format_Register.xlsx", size: 16824, kind: "Excel workbook", href: "/usecase/files/formats/Format_Register.xlsx" },
      { name: "Studio_Handover_Pack.pptx", size: 41210, kind: "PowerPoint deck", href: "/usecase/files/formats/Studio_Handover_Pack.pptx" },
      { name: "contact_sheet.png", size: 605273, kind: "Image", href: "/usecase/files/formats/contact_sheet.png" },
    ],
  },
];
