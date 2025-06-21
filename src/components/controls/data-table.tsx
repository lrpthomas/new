import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { MapPoint } from '../../types/map.types';
import styles from '../../styles/components/data-table.module.scss';

interface DataTableProps {
  points: MapPoint[];
  onPointSelect?: (point: MapPoint) => void;
  onPointDelete?: (pointId: string) => void;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export const DataTable: React.FC<DataTableProps> = ({
  points,
  onPointSelect,
  onPointDelete
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [filterText, setFilterText] = useState('');

  const allProperties = useMemo(() => {
    const properties = new Set<string>();
    points.forEach(point => {
      Object.keys(point.properties).forEach(key => properties.add(key));
    });
    return Array.from(properties);
  }, [points]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  }, []);

  const filteredAndSortedPoints = useMemo(() => {
    const filtered = points.filter(point => {
      const searchText = filterText.toLowerCase();
      return (
        point.id.toLowerCase().includes(searchText) ||
        Object.entries(point.properties).some(([, value]) =>
          String(value).toLowerCase().includes(searchText)
        )
      );
    });

    return filtered.sort((a, b) => {
      const aValue = sortConfig.key === 'id' ? a.id : a.properties[sortConfig.key];
      const bValue = sortConfig.key === 'id' ? b.id : b.properties[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [points, filterText, sortConfig]);

  const handleRowClick = useCallback(
    (point: MapPoint) => {
      onPointSelect?.(point);
    },
    [onPointSelect]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, pointId: string) => {
      e.stopPropagation();
      onPointDelete?.(pointId);
    },
    [onPointDelete]
  );

  const Row = useCallback(function Row({ index, style }: ListChildComponentProps) {
      const point = filteredAndSortedPoints[index];
      return (
        <tr
          style={style}
          key={point.id}
          onClick={() => handleRowClick(point)}
          className={styles.row}
        >
          <td>{point.id}</td>
          <td>{point.position.lat.toFixed(6)}</td>
          <td>{point.position.lng.toFixed(6)}</td>
          {allProperties.map(property => (
            <td key={property}>{point.properties[property] || '-'}</td>
          ))}
          <td>
            <button
              onClick={e => handleDelete(e, point.id)}
              className={styles.deleteButton}
              title="Delete point"
            >
              🗑️
            </button>
          </td>
        </tr>
      );
    },
    [filteredAndSortedPoints, handleRowClick, handleDelete, allProperties]
  );

  const OuterElement = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function OuterElement(props, ref) {
    return <tbody {...props} ref={ref as React.RefObject<HTMLTableSectionElement>} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Filter points..."
          value={filterText}
          onChange={handleFilter}
          className={styles.filterInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className={styles.sortable}>
                ID
                {sortConfig.key === 'id' && (
                  <span className={styles.sortIndicator}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Latitude</th>
              <th>Longitude</th>
              {allProperties.map(property => (
                <th key={property} onClick={() => handleSort(property)} className={styles.sortable}>
                  {property}
                  {sortConfig.key === property && (
                    <span className={styles.sortIndicator}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <FixedSizeList
            height={400}
            itemCount={filteredAndSortedPoints.length}
            itemSize={40}
            width="100%"
            outerElementType={OuterElement}
          >
            {Row}
          </FixedSizeList>
        </table>
      </div>

      {filteredAndSortedPoints.length === 0 && (
        <div className={styles.emptyState}>
          {filterText ? 'No points match your filter' : 'No points available'}
        </div>
      )}
    </div>
  );
};
