const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const app = express();

// Database connection parameters
const db = mysql.createConnection({
    host: 'project4500.cvyaqkkeo8sb.us-east-2.rds.amazonaws.com',   
    user: 'teamkam',   
    password: 'Schoolsystem1!', 
    port: '3306',
    database: 'Community_Finder',
    multipleStatements: 'true'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database with thread ID: ' + db.threadId);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
  }));

//get all info from a zip code PREVIEW
app.get("/zipcode-prev/:zipcode", (req, res) => {
    // Retrieve ZIP code from path parameters
    const zipcode = req.params.zipcode.replace(':', '');
    
    if (!zipcode) {
        res.status(400).send({ error: 'Zip code parameter is required' });
        return;
    }

    const query = `
    WITH zip2FIPS AS (
        SELECT 
            Z.county
        FROM
            ZipCounty Z
        WHERE
            Z.zip = ${zipcode}
    )
    SELECT
        CH.*,
        EC.*,
        L.*,
        SM.*,
        SC.*
    FROM
        zip2FIPS Z2F
    LEFT JOIN Communal_Health CH ON CH.Zipcode = ${zipcode}
    LEFT JOIN Effective_Care EC ON EC.Zipcode = ${zipcode}
    LEFT JOIN Liveability L ON L.FIPS = Z2F.county
    LEFT JOIN School_Metrics SM ON SM.Zipcode = ${zipcode}
    LEFT JOIN Social_Capital SC ON SC.zip = ${zipcode}
    LIMIT 5;`;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

//FULL info from a zip code
app.get("/zipcode-info/:zipcode", (req, res) => {
    // Retrieve ZIP code from path parameters
    const zipcode = req.params.zipcode.replace(':', '');
    
    if (!zipcode) {
        res.status(400).send({ error: 'Zip code parameter is required' });
        return;
    }

    const query = `
    WITH zip2FIPS AS (
        SELECT 
            Z.county
        FROM
            ZipCounty Z
        WHERE
            Z.zip = ${zipcode}
    )
    SELECT
        CH.*,
        EC.*,
        L.*,
        SM.*,
        SC.*
    FROM
        zip2FIPS Z2F
    LEFT JOIN Communal_Health CH ON CH.Zipcode = ${zipcode}
    LEFT JOIN Effective_Care EC ON EC.Zipcode = ${zipcode}
    LEFT JOIN Liveability L ON L.FIPS = Z2F.county
    LEFT JOIN School_Metrics SM ON SM.Zipcode = ${zipcode}
    LEFT JOIN Social_Capital SC ON SC.zip = ${zipcode};`;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

//query to find all info about a zipcode's school metrics, ordered by pupil-teacher-ratio
app.get("/school-info", (req, res) => {

    const query = `
    SELECT
        sm.Pupil_Teacher_Ratio, sm.NCESSCH, sm.School_Name, sm.State_Name, sm.State_Abbr, sm.County_Name, sm.Total_Students, sm.Male, sm.Female, sm.Two_More_Races, sm.Hawaiian_Pacific_Isl, sm.White, sm.African_American, sm.Hispanic, sm.American_Indian, sm.Asian, sm.FullTime_Teachers
    FROM
        School_Metrics sm
    ORDER BY sm.Pupil_Teacher_Ratio DESC LIMIT 5`;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

//query to find all info about a zipcode's Liveability metrics, ordered by D5AR!
app.get("/top-liveability", (req, res) => {
    const query = `
        SELECT *, D5AR AS Jobs_Within_45MIN_Travel
        FROM Liveability
        ORDER BY D5AR DESC LIMIT 5;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

//query to return ranking by number of hospitals per zip
app.get("/hospital-counts", (req, res) => {
    const query = `
    SELECT
        City_Town,
        Zipcode,
        COUNT(Zipcode) AS Hospital_Count
    FROM
        Effective_Care
    GROUP BY
        Zipcode
    ORDER BY Hospital_Count DESC LIMIT 5;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// Zip codes given by state abbreviation
app.get("/zips-by-state/:stateABBR", (req, res) => {
    const stateABBR = req.params.stateABBR.replace(':', '');
    if (!stateABBR) {
        res.status(400).send({ error: 'State Abbreviation parameter is required' });
        return;
    }

    const query = `
        SELECT zip, zip_name, zip_state
        FROM ZipCounty
        WHERE zip_state = '${stateABBR}';
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// states given by zip code
app.get("/state-by-zip/:zip", (req, res) => {
    const zip = req.params.zip.replace(':', '');
    if (!zip) {
        res.status(400).send({ error: 'Zip Code parameter is required' });
        return;
    }

    const query = `
        SELECT zip, zip_name, zip_state
        FROM ZipCounty
        WHERE zip = '${zip}';
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });
        console.log(filteredResults)

        res.send(filteredResults);
    });
});

// Healthcare scores and social capital indicators
app.get("/healthcare-social", (req, res) => {
    const query = `
        SELECT EC.FacilityName, EC.City_Town, EC.State, EC.ZipCode, 
               AVG(EC.Score) AS AverageScore, 
               AVG(SC.volunteering_rate_zip) AS AverageVolunteeringRate, 
               AVG(SC.civic_organizations_zip) AS AverageCivicOrganizations 
        FROM Effective_Care EC
        JOIN ZipCounty ZC ON EC.ZipCode = ZC.zip
        JOIN Social_Capital SC ON ZC.zip = SC.zip
        GROUP BY EC.FacilityName, EC.City_Town, EC.State, EC.ZipCode 
        ORDER BY AverageScore DESC
        LIMIT 10;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// Complex Query: health outcome relative to healthcare quality
app.get("/healthcare-outcomes", (req, res) => {
    const query = `
        SELECT 
            CH.Zipcode,
            ZC.zip_name,
            ZC.zip_state AS State,
            AVG(CH.Data_Value) AS Avg_Health_Value,
            MAX(EC.Score) AS Max_Care_Score,
            COUNT(DISTINCT EC.FacilityName) AS Number_of_Facilities
        FROM 
            Communal_Health CH
        JOIN 
            Effective_Care EC ON CH.Zipcode = EC.Zipcode
        JOIN 
            ZipCounty ZC ON CH.Zipcode = ZC.zip
        GROUP BY 
            CH.Zipcode, ZC.zip_name, ZC.zip_state
        HAVING 
            AVG(CH.Data_Value) > (SELECT AVG(Data_Value) FROM Communal_Health)
        ORDER BY 
            Avg_Health_Value DESC, Max_Care_Score DESC;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// Complex Query: health metrics per zipcode compared against state ang global avg
app.get("/health-comp", (req, res) => {
    const query = `
    SELECT
        CH.Zipcode,
        CH.StateAbbr,
        AVG(CH.Data_Value) AS Avg_Health_Value,
        State_Average,
        Global_Average,
        RANK() OVER (PARTITION BY CH.StateAbbr ORDER BY AVG(CH.Data_Value) DESC) AS Health_Rank
    FROM
        Communal_Health CH
    JOIN (
        SELECT
            StateAbbr,
            AVG(Data_Value) AS State_Average
        FROM
            Communal_Health
        GROUP BY
            StateAbbr
    ) SA ON CH.StateAbbr = SA.StateAbbr
    CROSS JOIN (
        SELECT
            AVG(Data_Value) AS Global_Average
        FROM
            Communal_Health
    ) GA
    GROUP BY
        CH.Zipcode,
        CH.StateAbbr,
        State_Average,
        Global_Average
    ORDER BY
        Avg_Health_Value DESC
    LIMIT 20;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// Long Complex Query: analyzes important statistics about any area to help find the best possible areas based on multiple factors:
    // avg pupil-teacher ratio of an area, avg community health index of an area, avg hospital care score in an area, 
    // economic conectivity (if above the average), walkability of the area, and count of high performance health care facilities in area.
app.get("/important-stats", (req, res) => {
    const query = `
    SELECT
        SM.School_Name,
        SM.Zipcode,
        SM.State_Name,
        AVG(SM.Pupil_Teacher_Ratio) AS Avg_Pupil_Teacher_Ratio,
        AVG(CH.Data_Value) AS Community_Health_Index,
        COALESCE(EC.Avg_Score, 0) AS Avg_Hospital_Care_Score,
        COALESCE(SC.Count, 0) AS Above_Avg_Economic_Connectivity,
        COALESCE(L.Average_Walkability, 0) AS Avg_Walkability_Index,
        EC.High_Performance_Facilities
    FROM
        School_Metrics SM
    LEFT JOIN
        Communal_Health CH ON SM.Zipcode = CH.Zipcode
    LEFT JOIN (
        SELECT
            Zipcode,
            AVG(Score) AS Avg_Score,
            SUM(CASE WHEN Score > 90 THEN 1 ELSE 0 END) AS High_Performance_Facilities
        FROM
            Effective_Care
        GROUP BY
            Zipcode
    ) EC ON SM.Zipcode = EC.Zipcode
    LEFT JOIN (
        SELECT
            zip,
            COUNT(*) AS Count
        FROM
            Social_Capital
        WHERE
            ec_zip > (SELECT AVG(ec_zip) FROM Social_Capital)
        GROUP BY
            zip
    ) SC ON SM.Zipcode = SC.zip
    LEFT JOIN (
        SELECT
            ZC.county,
            AVG(L.NatWalkInd) AS Average_Walkability
        FROM
            Liveability L
        JOIN
            ZipCounty ZC ON ZC.county = L.FIPS
        GROUP BY
            ZC.county
    ) L ON L.county = (SELECT county FROM ZipCounty ZC WHERE ZC.zip = SM.Zipcode LIMIT 1)
    GROUP BY
        SM.School_Name, SM.Zipcode, SM.State_Name
    HAVING
        Avg_Pupil_Teacher_Ratio < (SELECT AVG(Pupil_Teacher_Ratio) FROM School_Metrics)
    ORDER BY
        Community_Health_Index DESC, Avg_Hospital_Care_Score DESC, Above_Avg_Economic_Connectivity DESC
    LIMIT 20;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});

// LONG Compelx Query: ranks healthcare facilities by their performance scores within their respective states, 
// while also comparing each facility's score to avg community health metrics and overall state performance statistics, 
// integrating geographic and demographic context.
app.get("/best-hospitals", (req, res) => {
    const query = `
    SELECT DISTINCT
        ec.FacilityName,
        ec.City_Town,
        ec.State,
        ec.Score,
        liv.CSA_Name,
        avg_ec.Avg_Score AS AVG_Hospital_Quality_Score,
        avg_health.Avg_Community_Health,
        state_avg.Average_State_Score,
        state_variance.State_Score_Variance,
        RANK() OVER (PARTITION BY ec.State ORDER BY ec.Score DESC) AS State_Rank
    FROM Effective_Care ec
    JOIN ZipCounty zc ON ec.Zipcode = zc.zip
    JOIN (
        SELECT CSA_Name, FIPS
        FROM Liveability
    ) liv ON zc.county = liv.FIPS
    JOIN (
        SELECT Facility_ID, AVG(Score) AS Avg_Score
        FROM Effective_Care
        GROUP BY Facility_ID
    ) avg_ec ON ec.Facility_ID = avg_ec.Facility_ID
    JOIN (
        SELECT Zipcode, AVG(Data_Value) AS Avg_Community_Health
        FROM Communal_Health
        GROUP BY Zipcode
    ) avg_health ON ec.Zipcode = avg_health.Zipcode
    JOIN (
        SELECT State, AVG(Score) AS Average_State_Score
        FROM Effective_Care
        GROUP BY State
    ) state_avg ON ec.State = state_avg.State
    JOIN (
        SELECT State, VARIANCE(Score) AS State_Score_Variance
        FROM Effective_Care
        GROUP BY State
    ) state_variance ON ec.State = state_variance.State
    ORDER BY ec.Score DESC
    LIMIT 20;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error("Database query error: ", error);
            res.status(500).send({ error: 'Error in database operation', details: error.message });
            return;
        }
        const filteredResults = results.map(row => {
            const newRow = {};
            Object.keys(row).forEach(key => {
                if (row[key] !== null) { // Only add if not null
                    newRow[key] = row[key];
                }
            });
            return newRow;
        });

        res.send(filteredResults);
    });
});


app.post("/post", (req, res) => {
    console.log("Connected to React");
    db.query('SELECT * FROM your_table', (error, results, fields) => {
        if (error) throw error;
        console.log(results);
    });

    res.redirect("/");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});