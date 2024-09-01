# import numpy as np
# import pandas as pd
#
# hotels_path = '/Users/myronkharkover/Downloads/Pre-Processed Data/Timely_and_Effective_Care-Hospital.csv'
# col_names = ['Facility ID', 'Facility Name', 'City/Town', 'State', 'ZIP Code', 'County/Parish',
#              'Condition', 'Measure ID', 'Measure Name', 'Score', 'Sample']
# hotels = pd.read_csv(hotels_path, header=None, names=col_names, low_memory=False)
#
# missing_hotels = hotels.isin(["Not Available"])
# missing_hotels.head()
# missing_hotels = missing_hotels.any(axis=1)
# hotels = hotels.loc[(~missing_hotels).values, :]
# hotels.isin(["Not Available"]).any().any()

import pandas as pd

hotels_path = '/Users/myronkharkover/Downloads/Pre-Processed Data/School_Neighborhood_Poverty_Estimates%2C_2017-18.csv'

# If your CSV file has a header, you can directly read it and columns will be automatically named
hotels = pd.read_csv(hotels_path, low_memory=False)

# If you still wish to rename the columns explicitly
# hotels.columns = ['OBJECTID', 'STATEFP', 'COUNTYFP', 'CSA_Name', 'CountHU', 'TotPop', 'HH',	'D3A', 'D4A', 'D5AR']

# hotels = hotels[~hotels.isin(["very high"]).any(axis=1)]
# contains_na = hotels.isin(["very high"]).any().any()
hotels = hotels.dropna()
hotels.to_csv(hotels_path, index=False)