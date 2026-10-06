## Module 1: Introduction

- Data science = collecting, storing, processing and analysing data to support decisions; combines CS, statistics, maths and domain expertise.
- 3 Vs of data: Volume, Velocity, Variety.
- Applications: finance, public policy, healthcare, urban planning, education, business, industry.
- Skills: willingness to experiment, mathematical reasoning, data literacy. Roles: data analyst, data engineer, product-focused data scientist, generalist.
- Tools: Python, R, SQL, UNIX (plus Jupyter, Tableau/Power BI, Hadoop/Spark).
- Data types: structured vs unstructured; sources: open data, social media APIs, multimodal data; formats: CSV, TSV, XML, RSS.
- Preprocessing: cleaning, munging, missing values, smoothing noise, integration, reduction, discretization.
- Analytics types: descriptive, diagnostic, predictive, prescriptive, exploratory, mechanistic. Variance = Σ(x−x̄)²/(n−1); std dev = √variance.

## Module 2: Data Extraction

- Feature extraction turns raw data into clean, structured input; feature selection keeps the most useful attributes.
- Kaggle (William Cukierski): crowdsourced competitions, leaderboards, the 'leapfrogging' effect, ethical concerns.
- David Huffaker (Google): mixed-methods research, retention modelling, ethics and privacy.
- Feature selection methods: filter, wrapper (e.g. RFE), embedded (Lasso), hybrid; stepwise regression (forward, backward, bidirectional).
- Model criteria: R², adjusted R², p-values, AIC, BIC, entropy, cross-validation.
- Entropy H(X) = −p·log₂p − (1−p)·log₂(1−p); 0 = certain, 1 bit = maximum uncertainty.
- Decision trees: root, internal nodes, branches, leaves; built using information gain; continuous features use threshold splits.
- Random forests: bagging + random feature selection; accurate but less interpretable.
- SVD: X = USVᵀ for low-rank approximation; PCA gives uncorrelated components for dimensionality reduction.

## Module 3: Plotting and Visualization

- matplotlib basics: Figure, add_subplot, plt.subplots(nrows, ncols, sharex, sharey), subplots_adjust.
- Styling: colors, markers, line styles ('ko--'), drawstyle.
- Ticks, labels, legends: set_xticks, set_xticklabels, set_title, set_xlabel, label= + legend().
- Annotations and patches: ax.text, ax.annotate, Rectangle/Circle/Polygon with add_patch.
- Saving: plt.savefig('fig.png', dpi=400, bbox_inches='tight').
- rc() and matplotlibrc for global configuration.
- pandas plotting: Series/DataFrame .plot(), bar/barh, stacked=True; seaborn barplot with hue.
- Scatter plots (positive, negative, null correlation), FacetGrid, violin/strip/swarm plots, heatmaps, maps, network graphs.

## Module 4: Statistical Thinking

- Histograms (plt.hist) show the frequency distribution; PMFs normalise counts by sample size.
- Outliers: detect by sorting, visualization, z-score, IQR limits.
- Central tendency: mean, median, mode. Dispersion: range, variance, std, IQR. Shape: skewness, kurtosis.
- Population variance divides by N; sample variance divides by N−1.
- Charts: line, bar, column, pie, area, scatter, bubble.
- Class size paradox: students experience a larger average class size (e.g. 23.3) than the per-class average (20).
- DataFrame indexing: .loc (labels), .iloc (positions), Boolean filtering, set_index.
- CDF: fraction of values ≤ x; percentiles and percentile ranks (scipy.stats.percentileofscore).
- Random numbers: np.random.randint/rand/normal/shuffle (pseudo-random).
- Distributions: exponential (memoryless, mean 1/λ), normal (68–95–99.7 rule), lognormal (right-skewed, positive).

## Module 5: Time Series Analysis and Predictive Modeling

- Time series = observations ordered in time at regular intervals; used for forecasting, anomaly detection, planning.
- Components: trend, seasonality, cyclical, irregularity.
- Forecasting models: AR, ARIMA, SARIMA(X), VAR, exponential smoothing, Gaussian processes, random forests, GBM, state-space models, RNN/LSTM, HMM.
- Import with pd.read_csv(parse_dates, index_col); clean, set datetime index, asfreq()/resample().
- Moving averages: SMA = rolling(window).mean(); EMA = ewm(span).mean().
- Missing values: ffill, bfill, interpolate, or drop; sentinel values like −999.
- Serial correlation / autocorrelation: relation of a series with its lagged self (+1 strong positive, −1 strong negative).
- Evaluation: confusion matrix, accuracy, precision, recall, F1, ROC-AUC; regression: MAE, MSE, RMSE, R².
- Building a model: define goal → collect data → clean → feature engineering → 80/20 train-test split → choose model → tune → evaluate.
- Sentiment analysis extracts opinions/emotions from text (customer insight, brand monitoring).
