<template>
  <div>
    <h2 class='text-center'>Graph in D3</h2>
    <svg id='graph'></svg>
    <p>{{nodes}}</p>
    <p>{{links}}</p>
    <h2>{{elem}}</h2>
    <!-- <p>{{results}}</p> -->
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Graph',
  props: ['elem', 'results'],
  data () {
    return {
      graph: {},
      height: 400,
      width: 800,
      // width: this.graphSize(),
      collisionStrength: 0.7,
      nodeRadius: 30,
      linkDistance: 100
    }
  },
  mounted () {
  },
  methods: {
    drawGraph () {
      // const nodes = this.graph.nodes.map(d => Object.create(d))
      // const links = this.graph.links.map(d => Object.create(d))
      const nodes = this.nodes
      const links = this.links

      const simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('collide', d3.forceCollide(this.nodeRadius).strength(this.collisionStrength))
        .force('link', d3.forceLink(links).id(d => d.id).distance(this.linkDistance))
        .force('charge', d3.forceManyBody())

      const svg = d3.select('#graph')
        .attr('height', this.height)
        .attr('width', this.width)

      // clear existing graph (prevents redraw overlap)
      svg.selectAll('*').remove()

      const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

      const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(this.drag(simulation))

      node.append('circle')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('r', this.nodeRadius)
        .attr('fill', d => this.color(d))

      node.append('text')
        // .style('fill', 'blue')
        .attr('font-size', '0.8em')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('dy', 5)
        .text(d => d.id)

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
        node.attr('transform', d => `translate(${d.x}, ${d.y})`)
      })

      // invalidation.then(() => simulation.stop())
      return svg.node()
    },
    drag (simulation) {
      function dragstarted (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended (d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    color (d) {
      // const scale = d3.scaleOrdinal(d3.schemeCategory10)
      // console.log(d.group)
      // console.log(scale(d.group))
      // return scale(d.group)

      // console.log(d3.schemeCategory10[d.group])
      return d3.schemeCategory10[d.group]
    }
  },
  computed: {
    nodes: function () {
      var nodes = []
      // nodes.push({ id: this.elem, group: 0 })
      var nodesAux = {}
      nodesAux[this.elem] = 0

      this.results.forEach(elem => {
        // TODO: needs improvements
        // TODO check type (uri/literal)
        if (elem.subject) {
          if (!nodesAux[elem.subject.value]) nodesAux[elem.subject.value] = 1
        }
        if (elem.object) {
          if (!nodesAux[elem.object.value]) nodesAux[elem.object.value] = 1
        }
      })

      for (const id in nodesAux) {
        const value = nodesAux[id]
        nodes.push({ id: id, group: value })
      }
      return nodes
    },
    links: function () {
      var links = []
      // links.push({ id: this.elem, group: 0 })

      this.results.forEach(elem => {
        // TODO: needs improvements
        var source = this.elem
        var target = this.elem
        if (elem.subject) source = elem.subject.value
        if (elem.object) target = elem.object.value
        links.push({ source: source, target: target, value: 3 })
      })

      return links
    }
  }
}
</script>
