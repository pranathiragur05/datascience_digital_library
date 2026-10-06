/**
 * Data Science Digital Library - Experiment Catalog
 * Structured dataset for LeetCode-style Problem & Coding Workspace.
 */

(function () {
  const BASE_EXPERIMENTS = [
    // ----------------------------------------------------
    // EXPERIMENT 1: Python Basics & Computational Logic
    // ----------------------------------------------------
    {
      id: "exp-1a",
      number: 1,
      part: "a",
      title: "1a. Python List Operations & Filtering",
      category: "Python Basics",
      difficulty: "Easy",
      tags: ["python", "lists", "filtering", "comprehensions"],
      description: `Write a Python program that reads a line of space-separated integers from standard input, filters only the <b>positive even</b> numbers, computes their squares, and prints the resulting list.`,
      examples: [
        {
          input: "2 -4 5 6 7 8 10 -2",
          output: "Filtered Squares: [4, 36, 64, 100]"
        },
        {
          input: "1 3 5 7 9",
          output: "Filtered Squares: []"
        }
      ],
      constraints: "Numbers are integers between -1000 and 1000. Time complexity should be O(n).",
      learningObjectives: [
        "Read and parse space-separated standard input using input().split()",
        "Perform list filtering with conditional list comprehensions",
        "Handle edge cases such as empty input or odd-only arrays"
      ],
      hints: [
        "Use <code>[int(x) for x in input().strip().split()]</code> to parse integers.",
        "Use list comprehension condition: <code>[x**2 for x in nums if x > 0 and x % 2 == 0]</code>."
      ],
      defaultInput: "2 -4 5 6 7 8 10 -2",
      starterCode: `# 1a. List Comprehensions & Filtering
# Read space-separated integers from input and compute squares of positive evens

def solve():
    line = input().strip()
    if not line:
        print("Filtered Squares: []")
        return
    nums = [int(x) for x in line.split()]
    squares = [x**2 for x in nums if x > 0 and x % 2 == 0]
    print(f"Filtered Squares: {squares}")

solve()
`,
      expectedOutput: "Filtered Squares: [4, 36, 64, 100]",
      testCases: [
        {
          input: "2 -4 5 6 7 8 10 -2\n",
          expectedOutput: "Filtered Squares: [4, 36, 64, 100]"
        },
        {
          input: "1 3 5 7 9\n",
          expectedOutput: "Filtered Squares: []"
        },
        {
          input: "10 20 30\n",
          expectedOutput: "Filtered Squares: [100, 400, 900]"
        }
      ]
    },
    {
      id: "exp-1b",
      number: 1,
      part: "b",
      title: "1b. Word Frequency Counter with Dictionaries",
      category: "Python Basics",
      difficulty: "Easy",
      tags: ["python", "dictionaries", "strings", "hashmaps"],
      description: `Read a sentence from standard input, normalize all words to lowercase, remove punctuation, count the occurrences of each unique word, and print them in alphabetical order.`,
      examples: [
        {
          input: "Data science uses data to extract data insights.",
          output: "data: 3\nextract: 1\ninsights: 1\nscience: 1\nto: 1\nuses: 1"
        }
      ],
      constraints: "String contains up to 500 characters. Punctuation characters should be stripped.",
      learningObjectives: [
        "Clean and tokenize text strings using regular expressions",
        "Maintain hash maps for frequency counting with Python dict",
        "Sort keys alphabetically using sorted()"
      ],
      hints: [
        "Use <code>re.sub(r'[^a-zA-Z0-9\\s]', '', text.lower()).split()</code> to clean and split words.",
        "Use <code>freq[w] = freq.get(w, 0) + 1</code>."
      ],
      defaultInput: "Data science uses data to extract data insights.",
      starterCode: `# 1b. Word Frequency Counter
import re

def solve():
    text = input().strip()
    clean_text = re.sub(r'[^a-zA-Z0-9\\s]', '', text.lower())
    words = clean_text.split()
    
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
        
    for w in sorted(freq.keys()):
        print(f"{w}: {freq[w]}")

solve()
`,
      expectedOutput: `data: 3
extract: 1
insights: 1
science: 1
to: 1
uses: 1`,
      testCases: [
        {
          input: "Data science uses data to extract data insights.\n",
          expectedOutput: "data: 3\nextract: 1\ninsights: 1\nscience: 1\nto: 1\nuses: 1"
        },
        {
          input: "apple banana apple orange banana apple\n",
          expectedOutput: "apple: 3\nbanana: 2\norange: 1"
        }
      ]
    },
    {
      id: "exp-1c",
      number: 1,
      part: "c",
      title: "1c. Descriptive Statistics Calculator",
      category: "Python Basics",
      difficulty: "Medium",
      tags: ["python", "math", "statistics", "functions"],
      description: `Implement functions to compute the <b>Count</b>, <b>Mean</b>, <b>Sample Variance</b> ($s^2 = \\frac{\\sum(x-\\bar{x})^2}{n-1}$), and <b>Sample Standard Deviation</b> from scratch for a series of numbers entered via standard input.`,
      examples: [
        {
          input: "12 15 18 20 22 25 30",
          output: "Count: 7\nMean: 20.29\nVariance: 37.90\nStd Dev: 6.16"
        }
      ],
      constraints: "Number of elements n >= 2. Format floating point outputs to 2 decimal places.",
      learningObjectives: [
        "Implement basic statistical formulas in pure Python without external libraries",
        "Understand sample variance degrees of freedom (n - 1)",
        "Format floats using f-string precision"
      ],
      hints: [
        "Sample variance divides by (n - 1), whereas population variance divides by n."
      ],
      defaultInput: "12 15 18 20 22 25 30",
      starterCode: `# 1c. Descriptive Statistics Calculator
def solve():
    nums = [float(x) for x in input().strip().split()]
    n = len(nums)
    if n < 2:
        return
        
    mean = sum(nums) / n
    var = sum((x - mean) ** 2 for x in nums) / (n - 1)
    std = var ** 0.5
    
    print(f"Count: {n}")
    print(f"Mean: {mean:.2f}")
    print(f"Variance: {var:.2f}")
    print(f"Std Dev: {std:.2f}")

solve()
`,
      expectedOutput: `Count: 7
Mean: 20.29
Variance: 37.90
Std Dev: 6.16`,
      testCases: [
        {
          input: "12 15 18 20 22 25 30\n",
          expectedOutput: "Count: 7\nMean: 20.29\nVariance: 37.90\nStd Dev: 6.16"
        },
        {
          input: "10 20 30 40 50\n",
          expectedOutput: "Count: 5\nMean: 30.00\nVariance: 250.00\nStd Dev: 15.81"
        }
      ]
    },

    // ----------------------------------------------------
    // EXPERIMENT 2: Numerical Computing with NumPy
    // ----------------------------------------------------
    {
      id: "exp-2a",
      number: 2,
      part: "a",
      title: "2a. NumPy Array Creation & Reshaping",
      category: "NumPy",
      difficulty: "Easy",
      tags: ["numpy", "arrays", "matrix", "indexing"],
      description: `Create a 1D NumPy array of 12 integers from 1 to 12 using <code>np.arange()</code>, reshape it into a 3x4 matrix, extract the top-right 2x2 submatrix, and compute row sums and column means.`,
      examples: [
        {
          input: "(None)",
          output: "Matrix 3x4 with top-right submatrix and sums/means"
        }
      ],
      constraints: "Use NumPy vectorized functions.",
      learningObjectives: [
        "Generate numerical arrays using np.arange()",
        "Reshape dimensions without memory copy via reshape()",
        "Perform slice indexing and compute axis reductions"
      ],
      hints: [
        "Use <code>arr[:2, 2:]</code> to extract the top-right 2x2 submatrix."
      ],
      defaultInput: "",
      starterCode: `import numpy as np

# 1. Create 1D array of 12 integers and reshape to 3x4
arr = np.arange(1, 13).reshape(3, 4)
print("Original 3x4 Matrix:")
print(arr)

# 2. Extract top-right 2x2 submatrix
sub = arr[:2, 2:]
print("\\nTop-Right 2x2 Submatrix:")
print(sub)

# 3. Row sums and column means
print("\\nRow Sums:", arr.sum(axis=1))
print("Column Means:", arr.mean(axis=0))
`,
      expectedOutput: `Original 3x4 Matrix:
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]

Top-Right 2x2 Submatrix:
[[3 4]
 [7 8]]

Row Sums: [10 26 42]
Column Means: [5. 6. 7. 8.]`,
      testCases: []
    },
    {
      id: "exp-2b",
      number: 2,
      part: "b",
      title: "2b. Matrix Multiplication & Broadcasting",
      category: "NumPy",
      difficulty: "Medium",
      tags: ["numpy", "linear-algebra", "dot-product", "broadcasting"],
      description: `Multiply a 2x3 matrix $A$ and a 3x2 matrix $B$ using the <code>@</code> operator. Then, demonstrate broadcasting by centering matrix $A$ (subtracting the mean of each column from each row).`,
      examples: [
        {
          input: "(None)",
          output: "Matrix product and centered matrix"
        }
      ],
      constraints: "Ensure inner dimensions match for matrix dot products.",
      learningObjectives: [
        "Perform matrix multiplication with the @ operator",
        "Understand NumPy broadcasting rules across different shapes",
        "Center feature distributions by subtracting column means"
      ],
      hints: [
        "<code>A.mean(axis=0)</code> computes the mean for each column."
      ],
      defaultInput: "",
      starterCode: `import numpy as np

A = np.array([[1, 2, 3], [4, 5, 6]])
B = np.array([[7, 8], [9, 1], [2, 3]])

# Matrix product
C = A @ B
print("Matrix Product A @ B:")
print(C)

# Broadcasting: center columns
col_means = A.mean(axis=0)
centered = A - col_means
print("\\nColumn Means of A:", col_means)
print("Centered Matrix A:")
print(centered)
`,
      expectedOutput: `Matrix Product A @ B:
[[31 19]
 [85 55]]

Column Means of A: [2.5 3.5 4.5]
Centered Matrix A:
[[-1.5 -1.5 -1.5]
 [ 1.5  1.5  1.5]]`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 3: Data Analysis with Pandas
    // ----------------------------------------------------
    {
      id: "exp-3a",
      number: 3,
      part: "a",
      title: "3a. Pandas DataFrame Creation & Indexing",
      category: "Pandas",
      difficulty: "Easy",
      tags: ["pandas", "dataframe", "indexing", "loc-iloc"],
      description: `Create a Pandas DataFrame from a dictionary representing employee records with custom employee IDs. Demonstrate label-based selection using <code>.loc</code> and boolean mask filtering for Tech department staff with salary > 85000.`,
      examples: [
        {
          input: "(None)",
          output: "DataFrame with selected rows"
        }
      ],
      constraints: "Use pandas.DataFrame with index list.",
      learningObjectives: [
        "Construct DataFrames with custom string indices",
        "Filter records with loc and boolean condition masks",
        "Select specific column subsets"
      ],
      hints: [
        "Use <code>df[(df['Department'] == 'Tech') & (df['Salary'] > 85000)]</code>."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],
    'Department': ['HR', 'Tech', 'Tech', 'Finance', 'Tech'],
    'Salary': [65000, 85000, 92000, 78000, 88000],
    'Experience': [3, 5, 8, 4, 6]
}
emp_id = ['E101', 'E102', 'E103', 'E104', 'E105']

df = pd.DataFrame(data, index=emp_id)
print("Employee DataFrame:")
print(df)

print("\\nSelected by ID (E103) via .loc:")
print(df.loc['E103', ['Name', 'Salary']])

print("\\nTech Employees with Salary > 85000:")
tech_high = df[(df['Department'] == 'Tech') & (df['Salary'] > 85000)]
print(tech_high[['Name', 'Salary']])
`,
      expectedOutput: `Employee DataFrame:
          Name Department  Salary  Experience
E101     Alice         HR   65000           3
E102       Bob       Tech   85000           5
E103   Charlie       Tech   92000           8
E104     David    Finance   78000           4
E105       Eva       Tech   88000           6

Selected by ID (E103) via .loc:
Name      Charlie
Salary      92000
Name: E103, dtype: object

Tech Employees with Salary > 85000:
          Name  Salary
E103   Charlie   92000
E105       Eva   88000`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 4: Data Wrangling (Lab 4)
    // ----------------------------------------------------
    {
      id: "exp-4a",
      number: 4,
      part: "a",
      title: "4a. Hierarchical Indexing & Partial Indexing",
      category: "Data Wrangling",
      difficulty: "Medium",
      tags: ["pandas", "multiindex", "data-wrangling", "indexing"],
      description: `Create a Pandas MultiIndex Series representing student marks organized hierarchically by Department and Branch. Access partial hierarchical subsets using <code>.loc</code>.`,
      examples: [
        {
          input: "(None)",
          output: "MultiIndex Series with partial indexing outputs"
        }
      ],
      constraints: "Use pd.MultiIndex.from_arrays().",
      learningObjectives: [
        "Create MultiIndex hierarchical structures in Pandas",
        "Perform partial indexing to access entire department branches",
        "Select specific tuple key coordinates"
      ],
      hints: [
        "<code>marks.loc['Engineering']</code> returns all branches under Engineering."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

index = [['Engineering', 'Engineering', 'Science', 'Science'], ['CSE', 'ECE', 'Physics', 'Chemistry']]
mi = pd.MultiIndex.from_arrays(index, names=['Department', 'Branch'])
marks = pd.Series([85, 78, 92, 88], index=mi)

print("Full MultiIndex Series:")
print(marks)

print("\\nPartial Indexing ['Engineering']:")
print(marks.loc['Engineering'])

print("\\nSpecific Tuple ('Engineering', 'CSE'):")
print(marks.loc[('Engineering', 'CSE')])

print("\\nPartial Indexing ['Science']:")
print(marks.loc['Science'])
`,
      expectedOutput: `Full MultiIndex Series:
Department   Branch   
Engineering  CSE          85
             ECE          78
Science      Physics      92
             Chemistry    88
dtype: int64

Partial Indexing ['Engineering']:
Branch
CSE    85
ECE    78
dtype: int64

Specific Tuple ('Engineering', 'CSE'):
85

Partial Indexing ['Science']:
Branch
Physics      92
Chemistry    88
dtype: int64`,
      testCases: []
    },
    {
      id: "exp-4b",
      number: 4,
      part: "b",
      title: "4b. Rearranging Data with stack() and unstack()",
      category: "Data Wrangling",
      difficulty: "Medium",
      tags: ["pandas", "stack", "unstack", "reshaping"],
      description: `Create a hierarchical DataFrame with MultiIndex columns/rows. Pivot the innermost index level to column headers using <code>unstack()</code>, and reverse the operation using <code>stack()</code>.`,
      examples: [
        {
          input: "(None)",
          output: "Stacked and unstacked DataFrame representations"
        }
      ],
      constraints: "Use pd.MultiIndex.from_tuples().",
      learningObjectives: [
        "Reshape DataFrames between long and wide formats",
        "Pivot index levels to column headers with unstack()",
        "Re-stack columns back into hierarchical row indices"
      ],
      hints: [
        "<code>unstack()</code> moves the innermost row index to column levels."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

index = pd.MultiIndex.from_tuples([
    ('Engineering', 'CSE'),
    ('Engineering', 'ECE'),
    ('Science', 'Physics'),
    ('Science', 'Chemistry')
], names=['Department', 'Branch'])

data = pd.DataFrame({'2025': [85, 78, 92, 88], '2026': [90, 82, 95, 91]}, index=index)
print("Original MultiIndex DataFrame:")
print(data)

print("\\nUnstacked DataFrame:")
u = data.unstack()
print(u)

print("\\nRestacked DataFrame (returns to original):")
print(u.stack())
`,
      expectedOutput: `Original MultiIndex DataFrame:
                       2025  2026
Department  Branch               
Engineering CSE          85    90
            ECE          78    82
Science     Physics      92    95
            Chemistry    88    91

Unstacked DataFrame:
             2025                    2026                 
Branch        CSE ECE Chemistry Physics CSE ECE Chemistry Physics
Department                                                
Engineering    85  78       NaN     NaN  90  82       NaN     NaN
Science       NaN NaN      88.0    92.0 NaN NaN      91.0    95.0

Restacked DataFrame (returns to original):
(stack() returns the original hierarchical layout)`,
      testCases: []
    },
    {
      id: "exp-4c",
      number: 4,
      part: "c",
      title: "4c. Merge on Index & combine_first()",
      category: "Data Wrangling",
      difficulty: "Medium",
      tags: ["pandas", "merge", "combine-first", "join"],
      description: `Perform an outer merge between two DataFrames based on their indices, and demonstrate patching null values from one DataFrame into another using <code>combine_first()</code>.`,
      examples: [
        {
          input: "(None)",
          output: "Merged DataFrame and combined_first result"
        }
      ],
      constraints: "Use pd.merge(..., left_index=True, right_index=True).",
      learningObjectives: [
        "Merge DataFrames on row index identifiers",
        "Resolve missing attributes using combine_first()",
        "Understand outer join behavior with suffixes"
      ],
      hints: [
        "<code>df1.combine_first(df2)</code> fills nulls in df1 with values from df2."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

df1 = pd.DataFrame({'Name': ['Ravi', 'Sita', 'Arun'], 'Marks': [85, None, 78], 'Grade': ['A', 'B', None]}, index=[101, 102, 103])
df2 = pd.DataFrame({'Name': ['Ravi', 'Sita', 'Kiran'], 'Marks': [90, 88, 82], 'Grade': [None, 'A', 'B']}, index=[101, 102, 104])

print("Outer Merge on Index:")
m = pd.merge(df1, df2, left_index=True, right_index=True, how='outer', suffixes=('_DF1', '_DF2'))
print(m)

print("\\nCombining with combine_first (df1 priority):")
print(df1.combine_first(df2))
`,
      expectedOutput: `Outer Merge on Index:
    Name_DF1  Marks_DF1 Grade_DF1 Name_DF2  Marks_DF2 Grade_DF2
101     Ravi       85.0         A     Ravi       90.0      None
102     Sita        NaN         B     Sita       88.0         A
103     Arun       78.0      None      NaN        NaN       NaN
104      NaN        NaN       NaN    Kiran       82.0         B

Combining with combine_first (df1 priority):
      Name  Marks Grade
101   Ravi   85.0     A
102   Sita   88.0     B
103   Arun   78.0  None
104  Kiran   82.0     B`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 5: Data Visualization (Lab 5)
    // ----------------------------------------------------
    {
      id: "exp-5a",
      number: 5,
      part: "a",
      title: "5a. Line Plot with Labels, Ticks & Annotation",
      category: "Data Visualization",
      difficulty: "Medium",
      tags: ["matplotlib", "visualization", "line-plot", "annotation"],
      description: `Create a line plot displaying monthly sales from Jan to Jun. Configure title, labels, custom tick markers, add an arrow annotation pointing to the highest sales month, and render the figure.`,
      examples: [
        {
          input: "(None)",
          output: "Line plot figure with annotation"
        }
      ],
      constraints: "Use matplotlib.pyplot.",
      learningObjectives: [
        "Create subplots with custom dimensions",
        "Annotate specific data coordinates with arrows",
        "Configure custom tick marks, labels, and legends"
      ],
      hints: [
        "Use <code>ax.annotate('Highest Sales', xy=(5, 250), xytext=(3.5, 262), arrowprops=dict(arrowstyle='->'))</code>."
      ],
      defaultInput: "",
      starterCode: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 150, 180, 160, 220, 250]

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(months, sales, marker="o", color="#6c5ce7", linewidth=2.5, label="Sales (in K)")
ax.set_title("Monthly Sales Trend (Jan - Jun)")
ax.set_xlabel("Month")
ax.set_ylabel("Sales ($K)")
ax.set_xticks(range(6))
ax.set_xticklabels(months)
ax.annotate("Highest Sales", xy=(5, 250), xytext=(3.5, 260),
            arrowprops=dict(facecolor="#e0558a", shrink=0.05, width=1.5, headwidth=8))
ax.legend()
ax.grid(True, linestyle="--", alpha=0.6)

plt.tight_layout()
plt.show()
print("Plot generated successfully.")
`,
      expectedOutput: `Plot generated successfully.`,
      testCases: []
    },
    {
      id: "exp-5b",
      number: 5,
      part: "b",
      title: "5b. Grouped and Stacked Bar Plots",
      category: "Data Visualization",
      difficulty: "Medium",
      tags: ["matplotlib", "bar-chart", "grouped", "stacked"],
      description: `Plot grouped and stacked bar charts comparing quarterly sales performance across product departments.`,
      examples: [
        {
          input: "(None)",
          output: "Grouped and stacked bar charts"
        }
      ],
      constraints: "Use pandas.DataFrame.plot(kind='bar', stacked=True).",
      learningObjectives: [
        "Compare categorical metrics using grouped bar plots",
        "Plot cumulative totals using stacked bar plots",
        "Rotate axis labels for readability"
      ],
      hints: [
        "Use <code>df.plot(kind='bar', stacked=True)</code>."
      ],
      defaultInput: "",
      starterCode: `import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    'Q1': [45, 60, 30],
    'Q2': [55, 70, 40],
    'Q3': [65, 80, 50]
}, index=['Electronics', 'Apparel', 'Grocery'])

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

# 1. Grouped Bar Plot
df.plot(kind='bar', ax=axes[0], colormap='viridis')
axes[0].set_title("Grouped Quarterly Sales")
axes[0].set_ylabel("Sales ($)")

# 2. Stacked Bar Plot
df.plot(kind='bar', stacked=True, ax=axes[1], colormap='magma')
axes[1].set_title("Stacked Quarterly Sales")

plt.tight_layout()
plt.show()
print("Bar plots generated.")
`,
      expectedOutput: `Bar plots generated.`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 6: Time Series Analysis (Lab 6)
    // ----------------------------------------------------
    {
      id: "exp-6a",
      number: 6,
      part: "a",
      title: "6a. Time Series Creation with Timestamps",
      category: "Time Series",
      difficulty: "Medium",
      tags: ["pandas", "time-series", "datetime", "timestamps"],
      description: `Create a Pandas time series indexed by explicit datetime timestamps. Access values using string date indexing and datetime slices.`,
      examples: [
        {
          input: "(None)",
          output: "Time series indexed by DatetimeIndex"
        }
      ],
      constraints: "Use pd.to_datetime().",
      learningObjectives: [
        "Construct DatetimeIndex objects in Pandas",
        "Slice time series using partial string dates",
        "Inspect frequency properties"
      ],
      hints: [
        "Pandas allows indexing with strings like <code>ts['2026-01-02']</code>."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

dates = pd.to_datetime(['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'])
ts = pd.Series([100, 150, 200, 250], index=dates)

print("Time Series:")
print(ts)

print("\\nAccess by Date String '2026-01-02':")
print(ts['2026-01-02'])

print("\\nDate Slice ['2026-01-02':'2026-01-04']:")
print(ts['2026-01-02':'2026-01-04'])
`,
      expectedOutput: `Time Series:
2026-01-01    100
2026-01-02    150
2026-01-03    200
2026-01-04    250
dtype: int64

Access by Date String '2026-01-02':
150

Date Slice ['2026-01-02':'2026-01-04']:
2026-01-02    150
2026-01-03    200
2026-01-04    250
dtype: int64`,
      testCases: []
    },
    {
      id: "exp-6g",
      number: 6,
      part: "g",
      title: "6g. Resampling: Downsampling & Upsampling",
      category: "Time Series",
      difficulty: "Hard",
      tags: ["pandas", "time-series", "resampling", "downsampling", "upsampling"],
      description: `Demonstrate time series frequency resampling using <code>resample()</code>: downsampling hourly readings to 3-hour averages and 4-hour totals, and upsampling to 30-minute intervals with forward fill.`,
      examples: [
        {
          input: "(None)",
          output: "Downsampled and upsampled time series"
        }
      ],
      constraints: "Use pd.date_range() with frequency strings.",
      learningObjectives: [
        "Downsample high-frequency readings with aggregation functions",
        "Upsample sparse series using ffill() interpolation",
        "Understand temporal aggregation windows"
      ],
      hints: [
        "<code>ts.resample('3h').mean()</code> computes 3-hour means."
      ],
      defaultInput: "",
      starterCode: `import pandas as pd

idx = pd.date_range('2026-01-01', periods=12, freq='h')
ts = pd.Series([10, 12, 15, 14, 18, 20, 22, 21, 25, 28, 30, 32], index=idx)

print("Original Hourly Series (first 4):")
print(ts.head(4))

print("\\nDownsampled to 3-Hour Mean:")
print(ts.resample('3h').mean())

print("\\nDownsampled to 4-Hour Sum:")
print(ts.resample('4h').sum())

print("\\nUpsampled to 30-Min with Forward Fill (first 6):")
print(ts.resample('30min').ffill().head(6))
`,
      expectedOutput: `Original Hourly Series (first 4):
2026-01-01 00:00:00    10
2026-01-01 01:00:00    12
2026-01-01 02:00:00    15
2026-01-01 03:00:00    14
Freq: h, dtype: int64

Downsampled to 3-Hour Mean:
2026-01-01 00:00:00    12.333333
2026-01-01 03:00:00    17.333333
2026-01-01 06:00:00    22.666667
2026-01-01 09:00:00    30.000000
Freq: 3h, dtype: float64

Downsampled to 4-Hour Sum:
2026-01-01 00:00:00     51
2026-01-01 04:00:00     81
2026-01-01 08:00:00    115
Freq: 4h, dtype: int64

Upsampled to 30-Min with Forward Fill (first 6):
2026-01-01 00:00:00    10
2026-01-01 00:30:00    10
2026-01-01 01:00:00    12
2026-01-01 01:30:00    12
2026-01-01 02:00:00    15
2026-01-01 02:30:00    15
Freq: 30min, dtype: int64`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 7: Statistical Inference & Outliers
    // ----------------------------------------------------
    {
      id: "exp-7a",
      number: 7,
      part: "a",
      title: "7a. Interquartile Range (IQR) Outlier Detection",
      category: "Statistics",
      difficulty: "Medium",
      tags: ["statistics", "outliers", "iqr", "tukey"],
      description: `Implement the 1.5x IQR rule to detect and isolate numerical outliers from an input dataset: $Q_1 = 25\\text{th percentile}$, $Q_3 = 75\\text{th percentile}$, $\\text{IQR} = Q_3 - Q_1$, $\\text{Lower} = Q_1 - 1.5\\times\\text{IQR}$, $\\text{Upper} = Q_3 + 1.5\\times\\text{IQR}$.`,
      examples: [
        {
          input: "(None)",
          output: "Detected outliers and clean data count"
        }
      ],
      constraints: "Use numpy.percentile().",
      learningObjectives: [
        "Calculate quartiles and IQR in Python",
        "Establish lower and upper outlier fence boundaries",
        "Separate anomalies from valid observations"
      ],
      hints: [
        "<code>np.percentile(data, [25, 75])</code> gives Q1 and Q3."
      ],
      defaultInput: "",
      starterCode: `import numpy as np

data = np.array([22, 24, 25, 26, 28, 29, 30, 31, 32, 34, 35, 88, 5, 33])

q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1

lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr

outliers = data[(data < lower) | (data > upper)]
clean = data[(data >= lower) & (data <= upper)]

print(f"Data count: {len(data)}")
print(f"Q1: {q1:.1f}, Q3: {q3:.1f}, IQR: {iqr:.1f}")
print(f"Outlier Fences: [{lower:.1f}, {upper:.1f}]")
print(f"Detected Outliers: {outliers.tolist()}")
print(f"Clean Records Count: {len(clean)}")
`,
      expectedOutput: `Data count: 14
Q1: 25.2, Q3: 32.8, IQR: 7.5
Outlier Fences: [14.0, 44.0]
Detected Outliers: [88, 5]
Clean Records Count: 12`,
      testCases: []
    },

    // ----------------------------------------------------
    // EXPERIMENT 9: Machine Learning & Predictive Modeling
    // ----------------------------------------------------
    {
      id: "exp-9a",
      number: 9,
      part: "a",
      title: "9a. Simple Linear Regression from Scratch",
      category: "Machine Learning",
      difficulty: "Medium",
      tags: ["machine-learning", "linear-regression", "ols", "r-squared"],
      description: `Implement Ordinary Least Squares (OLS) Linear Regression from scratch: compute slope ($m$), intercept ($c$), coefficient of determination ($R^2$), Root Mean Squared Error (RMSE), and predict the target for a new feature input.`,
      examples: [
        {
          input: "(None)",
          output: "Regression line, R2, RMSE and prediction"
        }
      ],
      constraints: "Do not import scikit-learn. Implement formulas directly with NumPy.",
      learningObjectives: [
        "Derive and compute closed-form OLS parameters",
        "Calculate goodness-of-fit metrics (R2 and RMSE)",
        "Generate point predictions for unseen features"
      ],
      hints: [
        "Slope $m = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sum (x-\\bar{x})^2}$."
      ],
      defaultInput: "",
      starterCode: `import numpy as np

# Study hours (X) vs Exam Score (Y)
x = np.array([1, 2, 3, 4, 5, 6, 7, 8])
y = np.array([45, 52, 60, 68, 74, 82, 89, 95])

x_mean = np.mean(x)
y_mean = np.mean(y)

m = np.sum((x - x_mean) * (y - y_mean)) / np.sum((x - x_mean) ** 2)
c = y_mean - m * x_mean

y_pred = m * x + c
ss_tot = np.sum((y - y_mean) ** 2)
ss_res = np.sum((y - y_pred) ** 2)
r2 = 1 - (ss_res / ss_tot)
rmse = np.sqrt(np.mean((y - y_pred) ** 2))

print(f"Regression Line: y = {m:.3f}x + {c:.3f}")
print(f"R-squared (R2): {r2:.4f}")
print(f"RMSE: {rmse:.4f}")

# Predict for 9.5 hours
new_x = 9.5
print(f"Prediction for {new_x} hours: {m * new_x + c:.2f}")
`,
      expectedOutput: `Regression Line: y = 7.214x + 37.786
R-squared (R2): 0.9972
RMSE: 0.8874
Prediction for 9.5 hours: 106.32`,
      testCases: []
    }
  ];

  // Export to global scope
  window.EXPERIMENTS_DATA = BASE_EXPERIMENTS;
})();
