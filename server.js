const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// --- FONTE ÚNICA DA VERDADE ---
const formConfig = {
  dispensasGerais: [
    { numeral: "I", text: "Policiamento externo armado" },
    { numeral: "II", text: "Policiamento externo desarmado" },
    { numeral: "III", text: "Policiamento externo a pé" },
    { numeral: "IV", text: "Policiamento em meio de transporte" },
    { numeral: "V", text: "Policiamento interno armado" },
    { numeral: "VI", text: "Policiamento interno desarmado" },
    { numeral: "VII", text: "Policiamento velado armado" },
    { numeral: "VIII", text: "Policiamento velado desarmado" },
    { numeral: "IX", text: "Atendimento pré hospitalar" },
    { numeral: "X-a", text: "Busca e salvamento: terrestre e subterrâneo" },
    { numeral: "X-b", text: "Busca e salvamento: aéreo e em altura" },
    { numeral: "X-c", text: "Busca e salvamento: aquático" },
    { numeral: "XI-a", text: "Mergulho: autônomo" },
    { numeral: "XI-b", text: "Mergulho: livre" },
    { numeral: "XII", text: "Combate a incêndio" },
    { numeral: "XIII", text: "Prevenção de incêndio" },
    { numeral: "XIV", text: "Maneabilidade" },
    { numeral: "XV", text: "Ordem unida" },
    { numeral: "XVI-a", text: "Atividade física: terrestre" },
    { numeral: "XVI-b", text: "Atividade física: em altura" },
    { numeral: "XVI-c", text: "Atividade física: aquática" },
    { numeral: "XVII", text: "Defesa pessoal" },
    { numeral: "XVIII", text: "Equitação" },
    { numeral: "XIX", text: "Tiro" },
    { numeral: "XX", text: "Uso e manuseio de armamento" },
    { numeral: "XXI", text: "Condução de viatura policial caracterizada" },
    { numeral: "XXII", text: "Condução de viatura descaracterizada" },
    {
      numeral: "XXIII",
      text: "Atividades com levantamento de material pesado",
    },
    { numeral: "XXIV", text: "Atividades de rádio operação" },
    { numeral: "XXV", text: "Atividades de telecomunicação" },
    { numeral: "XXVI", text: "Atividades musicais" },
    { numeral: "XXVII", text: "Atividades de docência" },
    {
      numeral: "XXVIII",
      text: "Atividades com exposição a material radioativo",
    },
    { numeral: "XXIX", text: "Atividades assistenciais de saúde" },
    { numeral: "XXX", text: "Esportes coletivos" },
    { numeral: "XXXI-a", text: "Atividades de impacto: corrida" },
    {
      numeral: "XXXI-b",
      text: "Atividades de impacto: flexão e barra (membro superior)",
    },
    { numeral: "XXXI-c", text: "Atividades de impacto: flexão abdominal" },
    { numeral: "XXXI-d", text: "Atividades de impacto: outros" },
    { numeral: "XXXII", text: "Serviço noturno" },
    { numeral: "XXXIII", text: "Atividades com exposição a ruído elevado" },
    { numeral: "XXXIV-a", text: "Ato de barbear-se: diariamente" },
    { numeral: "XXXIV-b", text: "Ato de barbear-se: a cada X dias" },
    { numeral: "XXXV", text: "Uso de fardamento interno, exceto agasalho" },
    { numeral: "XXXVI", text: "Uso de fardamento externo" },
    { numeral: "XXXVII-a", text: "Uso de itens de fardamento: cobertura" },
    {
      numeral: "XXXVII-b",
      text: "Uso de itens de fardamento: coturno e equivalentes",
    },
    {
      numeral: "XXXVII-c",
      text: "Uso de itens de fardamento: calçado fechado rígido",
    },
    { numeral: "XXXVIII", text: "Outros (especificar)" },
  ],
  adaptacaoPedagogica: {
    "1. Ordem Unida": [
      "Executar movimentos de ordem unida a pé firme desarmados",
      "Executar movimentos de ordem unida a pé firme armados",
      "Executar movimentos de ordem unida em deslocamento desarmados",
      "Executar movimentos de ordem unida em deslocamento armados",
      "Executar comandos de voz",
      "Executar comandos de gesto",
      "Ministrar instrução teórica",
      "Outros (especificar)",
    ],
    "2. Defesa Pessoal": [
      "Executar posturas defensivas",
      "Executar posicionamentos para abordagens",
      "Executar técnicas de esquivas contra golpes",
      "Executar agachamento",
      "Executar rolamento",
      "Executar flexão",
      "Executar técnicas de manutenção de distância de agressor",
      "Executar técnicas de forçamento de articulações (punho, cotovelo, ombro)",
      "Executar técnicas de defesa utilizando membros superiores",
      "Executar técnicas de defesa utilizando membros inferiores",
      "Executar técnicas de ataque utilizando membros superiores",
      "Executar técnicas de ataque utilizando membros inferiores",
      "Executar abdominais",
      "Executar defesa contra agarramentos: gola, pescoço e punho",
      "Executar técnicas de imobilizações em decúbito ventral",
      "Executar técnicas de queda e imobilizações de solo",
      "Sofrer técnicas de queda e imobilizações de solo",
      'Executar técnicas de "quebra de resistência" e defesa contra agressores desarmados',
      "Executar técnicas de forçamento de articulações e imobilizações",
      "Executar técnicas de algemação e condução com as mãos livres",
      "Executar posições de alongamento e aquecimento com forçamento moderado",
      "Executar corrida moderada de aquecimento",
      "Executar técnicas de porte, saque e empunhadura de tonfa",
      "Executar movimentos de ataque e defesa com tonfa/bastão",
      "Executar como forma pedagógica o movimento contrário",
      "Outros (especificar)",
    ],
    "3. Técnica Policial Militar": [
      "Utilizar arma de fogo desmuniciada",
      "Utilizar arma de fogo com festim",
      "Executar abordagem a pessoa suspeita",
      "Realizar busca pessoal",
      "Sofrer busca pessoal",
      "Abordagem a veículos",
      "Executar escolta policial",
      "Outros (especificar)",
    ],
    "4. Educação Física": [
      "Corrida 2.400m",
      "Corrida 200 m",
      "Flexão Abdominal",
      "Flexão Barra",
      "Barra fixa- feminina",
      "Caminhadas",
      "Treinamento para corridas",
      "Treinamento para abdominais",
      "Treinamento para barra",
      "Treinamento de agilidade",
      "Treinamento de impulsão vertical",
      "Treinamento de ritmo aeróbico",
      "Treinamento de resistência muscular dorsal",
      "Treinamento de resistência muscular dos membros superiores",
      "Treinamento de resistência muscular dos membros inferiores",
      "Treinamento anaeróbico",
      "Outros (especificar)",
    ],
    "5. Armamento e Tiro": [
      "Manusear arma de fogo desmuniciada",
      "Manusear arma de fogo municiada com munição de manejo",
      "Desmontar e montar armas",
      "Realizar tiro em pé com arma de porte",
      "Realizar tiro na posição sentada sobre as próprias pernas com arma de porte",
      "Realizar tiro na posição de joelhos com arma de porte",
      "Realizar tiro na posição deitada com arma de porte",
      "Realizar tiro em pé com arma portátil",
      "Realizar tiro na posição sentada sobre as próprias pernas com arma portátil",
      "Realizar tiro na posição de joelhos com arma portátil",
      "Realizar tiro na posição deitada com arma portátil",
      "Realizar tiro de arma portátil no modo rajada",
      "Realizar tiro em pé com arma de porte partindo de barricada",
      "Realizar tiro na posição sentada sobre as próprias pernas com arma de porte partindo de barricada",
      "Realizar tiro na posição de joelhos com arma de porte partindo de barricada",
      "Realizar tiro na posição deitada com arma de porte partindo de barricada",
      "Realizar tiro em pé com arma portátil partindo de barricada",
      "Realizar tiro na posição sentada sobre as próprias pernas com arma portátil partindo de barricada",
      "Realizar tiro na posição de joelhos com arma portátil partindo de barricada",
      "Realizar tiro na posição deitada com arma portátil partindo de barricada",
      "Uso de itens de fardamento: Máscara de Proteção Respiratória",
      "Uso de itens de fardamento: Colete balístico",
      "Uso de itens de fardamento: Escudo balístico",
      "Uso de itens de fardamento: Capacete balístico",
      "Manusear Espargidores e granadas de mão",
      "Lançar Espargidores e granadas de mão",
      "Manusear Armas de Impulso Elétrico",
      "Utilizar Armas de Impulso Elétrico",
      "Outros (especificar)",
    ],
    "6. Estágio Supervisionado": [
      "Sentinela interno armado",
      "Sentinela interno desarmado",
      "Auxiliar sala de armas",
      "Auxiliar de Seção de Transporte",
      "Auxiliar no Olho Vivo",
      "Auxiliar na Recepção",
      "Policiamento externo a pé",
      "Policiamento interno a pé",
      "Fardar uniforme B1",
      "Fardar uniforme C1",
      "Uniformizar com D2 (agasalho de educação física)",
      "Policiamento Externo - viatura",
      "Sargenteação",
      "Operador da SOU",
      "Atividade de Rádio Patrulhamento",
      "Prática do comando de guarnição de rádio patrulhamento",
      "Prática do comando de guarnição motorizada de 4 rodas",
      "Atividade de Patrulha de Operações (POP)",
      "Atividade de Grupo Especializado em Policiamento em Áreas de Risco (GEPAR)",
      "Coordenador Sala de Armas",
      "Outros (especificar)",
    ],
  },
};
const toSqlName = (text, prefix = "") =>
  `${prefix}${text}`.replace(/[^a-zA-Z0-9_]/g, "_");

const dbPath = path.join(__dirname, "banco.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err)
    return console.error("Erro ao conectar ao banco de dados:", err.message);

  console.log("Conectado ao banco de dados 'banco.db'.");

  let createTableQuery = `CREATE TABLE IF NOT EXISTS relatorios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        numero_pm TEXT,
        unidade_origem TEXT,
        unidade_nais_sas TEXT,
        ata_jcs TEXT,`;

  formConfig.dispensasGerais.forEach((item) => {
    createTableQuery += `      "${toSqlName(item.text, "disp_")}" TEXT,\n`;
  });

  Object.keys(formConfig.adaptacaoPedagogica).forEach((category) => {
    formConfig.adaptacaoPedagogica[category].forEach((item) => {
      const colName = toSqlName(`${category}_${item}`, "apto_");
      createTableQuery += `      "${colName}" TEXT,\n`;
    });
  });

  createTableQuery += "data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP)";

  db.run(createTableQuery, (err) => {
    if (err) return console.error("Erro ao criar a tabela:", err.message);
    console.log("Tabela 'relatorios' está pronta e com todas as colunas.");
  });
});

const apiRouter = express.Router();

apiRouter.get("/config", (req, res) => {
  res.json(formConfig);
});

apiRouter.post("/salvar-relatorio", (req, res) => {
  const data = req.body;
  if (!data.dados_pessoais || !data.dados_pessoais.nome_completo) {
    return res
      .status(400)
      .json({ error: "Dados inválidos. O nome completo é obrigatório." });
  }

  let columns = [
    "nome_completo",
    "numero_pm",
    "unidade_origem",
    "unidade_nais_sas",
    "ata_jcs",
  ];
  let placeholders = ["?", "?", "?", "?", "?"];
  let values = [
    data.dados_pessoais.nome_completo,
    data.dados_pessoais.numero_pm,
    data.dados_pessoais.unidade_origem,
    data.dados_pessoais.unidade_nais_sas,
    data.dados_pessoais.ata_jcs,
  ];

  formConfig.dispensasGerais.forEach((item) => {
    columns.push(`"${toSqlName(item.text, "disp_")}"`);
    placeholders.push("?");
    values.push(data.dispensas_map[item.text] || "NAO");
  });

  Object.keys(formConfig.adaptacaoPedagogica).forEach((category) => {
    formConfig.adaptacaoPedagogica[category].forEach((item) => {
      columns.push(`"${toSqlName(`${category}_${item}`, "apto_")}"`);
      placeholders.push("?");
      const aptoValue =
        data.aptidoes_map[category] && data.aptidoes_map[category][item]
          ? data.aptidoes_map[category][item]
          : "NAO";
      values.push(aptoValue);
    });
  });

  const sql = `INSERT INTO relatorios (${columns.join(
    ", "
  )}) VALUES (${placeholders.join(", ")})`;

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err.message);
      return res
        .status(500)
        .json({ error: "Erro interno ao salvar no banco." });
    }
    res
      .status(201)
      .json({ message: "Relatório salvo com sucesso!", id: this.lastID });
  });
});

apiRouter.get("/get-relatorios", (req, res) => {
  const dispensaServicoNoturno = toSqlName("Serviço noturno", "disp_");
  const dispensaCorrida = toSqlName("Atividades de impacto: corrida", "disp_");
  const dispensaMembroSuperior = toSqlName(
    "Atividades de impacto: flexão e barra (membro superior)",
    "disp_"
  );
  const aptidaoMembroInferior = toSqlName(
    "4. Educação Física_Treinamento de resistência muscular dos membros inferiores",
    "apto_"
  );

  const sql = `
    SELECT 
      *,
      CASE 
        WHEN "${dispensaServicoNoturno}" = 'SIM' THEN 'INAPTO'
        ELSE 'APTO'
      END as status_servico_noturno,
      CASE
        WHEN "${dispensaCorrida}" = 'SIM' THEN 'INAPTO'
        ELSE 'APTO'
      END as status_corrida,
      CASE
        WHEN "${dispensaMembroSuperior}" = 'SIM' THEN 'INAPTO'
        ELSE 'APTO'
      END as status_membro_superior,
      CASE
        WHEN "${aptidaoMembroInferior}" = 'NAO' THEN 'INAPTO'
        ELSE 'APTO'
      END as status_membro_inferior
    FROM relatorios 
    ORDER BY nome_completo ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

apiRouter.put("/atualizar-relatorio/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  let setClauses = [];
  let values = [];

  Object.keys(data.dados_pessoais).forEach((key) => {
    setClauses.push(`${key} = ?`);
    values.push(data.dados_pessoais[key]);
  });

  formConfig.dispensasGerais.forEach((item) => {
    const colName = toSqlName(item.text, "disp_");
    setClauses.push(`"${colName}" = ?`);
    values.push(data.dispensas_map[item.text] || "NAO");
  });

  Object.keys(formConfig.adaptacaoPedagogica).forEach((category) => {
    formConfig.adaptacaoPedagogica[category].forEach((item) => {
      const colName = toSqlName(`${category}_${item}`, "apto_");
      setClauses.push(`"${colName}" = ?`);
      const aptoValue =
        data.aptidoes_map[category] && data.aptidoes_map[category][item]
          ? data.aptidoes_map[category][item]
          : "NAO";
      values.push(aptoValue);
    });
  });

  values.push(id);

  const sql = `UPDATE relatorios SET ${setClauses.join(", ")} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro interno ao atualizar o banco." });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ message: `Relatório com ID ${id} não encontrado.` });
    }
    res
      .status(200)
      .json({ message: `Relatório ID ${id} atualizado com sucesso!` });
  });
});

apiRouter.delete("/excluir-relatorio/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM relatorios WHERE id = ?";

  db.run(sql, id, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro interno ao excluir do banco." });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ message: `Relatório com ID ${id} não encontrado.` });
    }
    res
      .status(200)
      .json({ message: `Relatório ID ${id} excluído com sucesso!` });
  });
});

apiRouter.post("/gerar-relatorio-grupo", (req, res) => {
  const { filtros } = req.body;

  if (!filtros || !Array.isArray(filtros) || filtros.length === 0) {
    return res.status(400).json({ error: "Nenhum filtro foi fornecido." });
  }

  const aptosWhereClauses = [];
  const inaptosWhereClauses = [];
  const allKnownColumns = {};

  formConfig.dispensasGerais.forEach((item) => {
    allKnownColumns[item.text] = {
      type: "dispensa",
      sqlName: toSqlName(item.text, "disp_"),
    };
  });
  Object.keys(formConfig.adaptacaoPedagogica).forEach((category) => {
    formConfig.adaptacaoPedagogica[category].forEach((itemText) => {
      const uniqueText = `${category} - ${itemText}`;
      allKnownColumns[uniqueText] = {
        type: "aptidao",
        sqlName: toSqlName(`${category}_${itemText}`, "apto_"),
      };
    });
  });

  for (const filtro of filtros) {
    const columnInfo = allKnownColumns[filtro];
    if (columnInfo) {
      if (columnInfo.type === "dispensa") {
        inaptosWhereClauses.push(`"${columnInfo.sqlName}" = 'SIM'`);
        aptosWhereClauses.push(`"${columnInfo.sqlName}" = 'NAO'`);
      } else if (columnInfo.type === "aptidao") {
        inaptosWhereClauses.push(`"${columnInfo.sqlName}" = 'NAO'`);
        aptosWhereClauses.push(`"${columnInfo.sqlName}" = 'SIM'`);
      }
    }
  }

  if (inaptosWhereClauses.length === 0) {
    return res.status(400).json({ error: "Filtros inválidos fornecidos." });
  }

  const inaptosSql = `
        SELECT id, nome_completo, numero_pm 
        FROM relatorios 
        WHERE ${inaptosWhereClauses.join(" OR ")}
        ORDER BY nome_completo
    `;

  const aptosSql = `
        SELECT id, nome_completo, numero_pm 
        FROM relatorios 
        WHERE ${aptosWhereClauses.join(" AND ")}
        ORDER BY nome_completo
    `;

  const promiseInaptos = new Promise((resolve, reject) => {
    db.all(inaptosSql, [], (err, rows) => (err ? reject(err) : resolve(rows)));
  });

  const promiseAptos = new Promise((resolve, reject) => {
    db.all(aptosSql, [], (err, rows) => (err ? reject(err) : resolve(rows)));
  });

  Promise.all([promiseAptos, promiseInaptos])
    .then(([aptos, inaptos]) => {
      res.json({ aptos, inaptos });
    })
    .catch((err) => {
      console.error("Erro ao gerar relatório de grupo:", err.message);
      res.status(500).json({ error: "Erro de banco de dados." });
    });
});

apiRouter.get("/relatorio-aptidao-fisica", (req, res) => {
  try {
    const gruposDeAptidao = {
      "Aptos para Corrida": [
        {
          column: toSqlName("Atividades de impacto: corrida", "disp_"),
          value: "NAO",
        },
      ],
      "Restrição para Membros Superiores": [
        {
          column: toSqlName(
            "Atividades de impacto: flexão e barra (membro superior)",
            "disp_"
          ),
          value: "SIM",
        },
      ],
      "Restrição para Membros Inferiores": [
        {
          column: toSqlName(
            "4. Educação Física_Treinamento de resistência muscular dos membros inferiores",
            "apto_"
          ),
          value: "NAO",
        },
      ],
      "Restrição para TAF Básico": [
        {
          column: toSqlName("Atividades de impacto: corrida", "disp_"),
          value: "SIM",
        },
        {
          column: toSqlName("Atividades de impacto: flexão abdominal", "disp_"),
          value: "SIM",
        },
        {
          column: toSqlName(
            "Atividades de impacto: flexão e barra (membro superior)",
            "disp_"
          ),
          value: "SIM",
        },
      ],
      "Inapto para Serviço Noturno": [
        { column: toSqlName("Serviço noturno", "disp_"), value: "SIM" },
      ],
    };

    const promises = Object.entries(gruposDeAptidao).map(
      ([nomeGrupo, condicoes]) => {
        return new Promise((resolve, reject) => {
          let joinOperator;
          if (nomeGrupo.startsWith("Aptos para")) {
            joinOperator = " AND ";
          } else if (nomeGrupo === "Restrição para TAF Básico") {
            joinOperator = " AND ";
          } else {
            joinOperator = " OR ";
          }

          const whereClause = condicoes
            .map((cond) => `"${cond.column}" = '${cond.value}'`)
            .join(joinOperator);

          const sql = `
            SELECT id, nome_completo, numero_pm
            FROM relatorios
            WHERE ${whereClause}
            ORDER BY nome_completo`;

          db.all(sql, [], (err, rows) => {
            if (err) {
              return reject(err);
            }
            resolve({ [nomeGrupo]: rows });
          });
        });
      }
    );

    Promise.all(promises)
      .then((results) => {
        const finalReport = results.reduce(
          (acc, current) => ({ ...acc, ...current }),
          {}
        );
        res.json(finalReport);
      })
      .catch((error) => {
        console.error("Erro ao processar relatório de aptidão:", error);
        res.status(500).json({
          error: "Falha ao processar uma ou mais consultas do relatório.",
        });
      });
  } catch (error) {
    console.error("Erro na rota /relatorio-aptidao-fisica:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const criteriosConfig = {
  membro_superior: {
    label: "Restrição para Membros Superiores",
    descricao: [
      "O militar possui a dispensa para 'Atividades de impacto: flexão e barra (membro superior)'.",
    ],
  },
  membro_inferior: {
    label: "Restrição para Membros Inferiores",
    descricao: [
      "O militar é considerado INAPTO para 'Treinamento de resistência muscular dos membros inferiores'.",
    ],
  },
  corrida: {
    label: "Restrição para Corrida",
    descricao: [
      "O militar possui a dispensa para 'Atividades de impacto: corrida'.",
    ],
  },
  servico_noturno: {
    label: "Restrição para Serviço Noturno",
    descricao: ["O militar possui a dispensa para 'Serviço noturno'."],
  },
};

apiRouter.get("/config/criterios", (req, res) => {
  res.json(criteriosConfig);
});

// ===================================================================
// LUGAR CORRETO PARA AS NOVAS ROTAS
// ===================================================================

apiRouter.post("/gerar-relatorio-classificacao", (req, res) => {
  const { criterios } = req.body;

  if (!criterios || !Array.isArray(criterios) || criterios.length === 0) {
    return res.status(400).json({ error: "Nenhum critério foi fornecido." });
  }
  if (criterios.length > 5) {
    return res.status(400).json({
      error: "Por favor, selecione no máximo 5 critérios para a classificação.",
    });
  }

  try {
    const allKnownColumns = {};
    formConfig.dispensasGerais.forEach((item) => {
      allKnownColumns[item.text] = {
        type: "dispensa",
        sqlName: toSqlName(item.text, "disp_"),
      };
    });
    Object.keys(formConfig.adaptacaoPedagogica).forEach((category) => {
      formConfig.adaptacaoPedagogica[category].forEach((itemText) => {
        const uniqueText = `${category} - ${itemText}`;
        allKnownColumns[uniqueText] = {
          type: "aptidao",
          sqlName: toSqlName(`${category}_${itemText}`, "apto_"),
        };
      });
    });

    const classificationClauses = [];
    const shortNames = [];

    criterios.forEach((filtro) => {
      const columnInfo = allKnownColumns[filtro];
      if (columnInfo) {
        let shortName = filtro
          .replace("Atividades de impacto: ", "")
          .replace("Treinamento de resistência muscular dos ", "");
        shortName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
        shortNames.push(shortName);

        if (columnInfo.type === "dispensa") {
          classificationClauses.push(
            `CASE WHEN "${columnInfo.sqlName}" = 'NAO' THEN '✔️' ELSE '❌' END`
          );
        } else {
          classificationClauses.push(
            `CASE WHEN "${columnInfo.sqlName}" = 'SIM' THEN '✔️' ELSE '❌' END`
          );
        }
      }
    });

    if (classificationClauses.length === 0) {
      return res.status(400).json({ error: "Critérios inválidos." });
    }

    const dynamicClassificationGroup =
      classificationClauses.join(" || ';' || ");

    const sql = `
      SELECT
        id, nome_completo, numero_pm,
        (${dynamicClassificationGroup}) as classification_group
      FROM relatorios
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erro de banco de dados." });
      }
      const groupedResults = {};
      rows.forEach((militar) => {
        const groupKey = militar.classification_group;
        if (!groupedResults[groupKey]) {
          groupedResults[groupKey] = [];
        }
        groupedResults[groupKey].push(militar);
      });
      res.json({ results: groupedResults, criteriaNames: shortNames });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

apiRouter.get("/relatorio-corrida-caminhada", (req, res) => {
  try {
    const dispensaCorridaCol = toSqlName(
      "Atividades de impacto: corrida",
      "disp_"
    );
    const aptidaoCaminhadaCol = toSqlName(
      "4. Educação Física_Caminhadas",
      "apto_"
    );

    const sql = `
      SELECT
        id, nome_completo, numero_pm,
        CASE
          WHEN "${dispensaCorridaCol}" = 'SIM' AND "${aptidaoCaminhadaCol}" = 'NAO'
            THEN 'NAO_PODE_CORRER_NEM_CAMINHAR'
          WHEN "${dispensaCorridaCol}" = 'SIM' AND "${aptidaoCaminhadaCol}" = 'SIM'
            THEN 'NAO_PODE_CORRER_PODE_CAMINHAR'
          WHEN "${dispensaCorridaCol}" = 'NAO' AND "${aptidaoCaminhadaCol}" = 'SIM'
            THEN 'PODE_TUDO'
          ELSE 'OUTROS'
        END as grupo
      FROM relatorios
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erro de banco de dados." });
      }
      const relatorioFinal = {
        naoPodeCorrer_podeCaminhar: [],
        naoPodeCorrer_nemCaminhar: [],
        podeTudo: [],
        outros: [],
      };
      rows.forEach((militar) => {
        switch (militar.grupo) {
          case "NAO_PODE_CORRER_PODE_CAMINHAR":
            relatorioFinal.naoPodeCorrer_podeCaminhar.push(militar);
            break;
          case "NAO_PODE_CORRER_NEM_CAMINHAR":
            relatorioFinal.naoPodeCorrer_nemCaminhar.push(militar);
            break;
          case "PODE_TUDO":
            relatorioFinal.podeTudo.push(militar);
            break;
          default:
            relatorioFinal.outros.push(militar);
            break;
        }
      });
      for (const key in relatorioFinal) {
        relatorioFinal[key].sort((a, b) =>
          a.nome_completo.localeCompare(b.nome_completo)
        );
      }
      res.json(relatorioFinal);
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ===================================================================
// ESTA LINHA CRÍTICA DEVE VIR DEPOIS DE TODAS AS ROTAS
// ===================================================================
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
